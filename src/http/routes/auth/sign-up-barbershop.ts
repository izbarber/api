import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { ConflictException } from '@/http/errors/conflict-exception'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'

export async function signUpBarbershop(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/auth/signup/barbershop',
    schema: {
      tags: ['Autenticação'],
      summary: 'Criação da barbearia e usuário membro (ADMIN) da mesma',
      body: z.object({
        user: z.object({
          name: z
            .string()
            .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
          email: z
            .string()
            .email({ message: 'Informe um endereço de e-mail válido' }),
          password: z.string().min(8, {
            message: 'A senha deve ter pelo menos 8 caracteres',
          }),
        }),
        barbershop: z.object({
          name: z
            .string()
            .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
          phone: z.string().regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, {
            message:
              'O número de telefone deve estar no formato (XX)XXXXX-XXXX',
          }),
          address: z
            .string()
            .min(5, { message: 'O endereço deve ter pelo menos 5 caracteres' }),
        }),
      }),
    },
    handler: async (request, reply) => {
      const { user, barbershop } = request.body

      const userWithSameEmail = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      })

      if (userWithSameEmail) {
        throw new ConflictException(
          'Já existe um usuário com o e-mail informado',
        )
      }

      const passwordHash = await hash(user.password, 8)

      const [createdUser, createdBarbershop] = await prisma.$transaction(
        async (tx) => {
          const createdUser = await tx.user.create({
            data: {
              name: user.name,
              email: user.email,
              password: passwordHash,
            },
          })

          const createdBarbershop = await tx.barbershop.create({
            data: {
              name: barbershop.name,
              phone: barbershop.phone,
              slug: createSlug(barbershop.name),
              address: barbershop.address,
              userId: createdUser.id,
            },
          })

          const createdMember = await tx.member.create({
            data: {
              role: 'ADMIN',
              barbershopId: createdBarbershop.id,
              userId: createdUser.id,
            },
          })

          return [createdUser, createdBarbershop, createdMember]
        },
      )

      const token = await reply.jwtSign(
        {
          sub: createdUser.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      reply.status(201).send({ barbershopId: createdBarbershop.id, token })
    },
  })
}
