import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { NotFoundException } from '@/http/errors/not-found-exception'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .route({
      method: 'GET',
      url: '/profile',
      schema: {
        tags: ['Autenticação'],
        summary: 'Obter perfil do usuário autenticado',
      },
      async handler(request, reply) {
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            name: true,
            email: true,
          },
        })

        if (!user) {
          throw new NotFoundException('Usuário não encontrado')
        }

        reply.send({ user })
      },
    })
}
