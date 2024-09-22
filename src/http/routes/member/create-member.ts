import { Role } from '@prisma/client'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { ConflictException } from '@/http/errors/conflict-exception'
import { NotFoundException } from '@/http/errors/not-found-exception'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import { generatePassword } from '@/utils/generate-password'

export async function createMember(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/barbershops/:barbershopId/members',
    schema: {
      tags: ['Membros'],
      summary: 'Criar membro para barbearia',
      params: z.object({
        barbershopId: z.string().uuid(),
      }),
      body: z.object({
        name: z
          .string()
          .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
        email: z
          .string()
          .email({ message: 'Informe um endereço de e-mail válido' }),
        role: z.enum([Role.ADMIN, Role.MEMBER], { message: 'Cargo inválido' }),
      }),
    },
    async handler(request, reply) {
      const { barbershopId } = request.params

      const barbershop = await prisma.barbershop.findUnique({
        where: {
          id: barbershopId,
        },
      })

      if (!barbershop) {
        throw new NotFoundException('Barbearia não encontrada')
      }

      const { email, name, role } = request.body

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      let userId = user?.id

      if (user) {
        userId = user.id

        const member = await prisma.member.findUnique({
          where: {
            barbershopId_userId: {
              barbershopId,
              userId,
            },
          },
        })

        if (member) {
          throw new ConflictException(
            'Já existe um membro na barbearia com o mesmo e-mail informado',
          )
        }
      }

      let generatedPassword

      await prisma.$transaction(async (tx) => {
        if (!user) {
          generatedPassword = generatePassword()
          const passwordHash = await hash(generatedPassword, 8)

          const { id } = await tx.user.create({
            data: {
              email,
              name,
              password: passwordHash,
            },
          })

          userId = id
        }

        await tx.member.create({
          data: {
            role,
            userId: userId!,
            barbershopId,
          },
        })
      })

      if (!user) {
        await resend.emails.send({
          // TODO: Change it to use real data.
          from: 'Acme <onboarding@resend.dev>',
          to: ['dev.gabrielramos@gmail.com'],
          subject: 'Usuário cadastrado com sucesso na Izibarber',
          html: `
            <p>Olá ${name},</p>
  
            <p>Sua senha para o sistema de agendamento na Izibarber foi criada com sucesso.</p>
  
            <p><strong>Senha:</strong> ${generatedPassword}</p>
  
            <p><strong>Importante</strong></p>
  
            <p>* <strong>Mude sua senha:</strong> Recomendamos que você altere sua senha assim que acessar o sistema.</p>
            <p>* <strong>Não compartilhe sua senha:</strong> Mantenha sua senha em sigilo.</p>
  
            <p>Atenciosamente,</p>
            <p>Izibarber</p>
          `,
        })
      }

      reply.status(201).send()
    },
  })
}
