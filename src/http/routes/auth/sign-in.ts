import { compare } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { UnauthorizedException } from '@/http/errors/unauthorized-exception'
import { prisma } from '@/lib/prisma'

export async function signIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/sign-in',
    schema: {
      tags: ['Autenticação'],
      summary: 'Login do usuário',
      body: z.object({
        email: z.string().email('Formato de e-mail inválido'),
        password: z
          .string()
          .min(1, { message: 'Informe um endereço de e-mail válido' }),
      }),
    },
    async handler(request, reply) {
      const { email, password } = request.body

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        throw new UnauthorizedException('Credenciais inválidas')
      }

      const isValidPassword = await compare(password, user.password)

      if (!isValidPassword) {
        throw new UnauthorizedException('Credenciais inválidas')
      }

      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      reply.status(201).send({ token })
    },
  })
}
