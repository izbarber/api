import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getMyBarbershops(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .route({
      method: 'GET',
      url: '/my-barbershops',
      schema: {
        tags: ['Autenticação'],
        summary: 'Listar barbearias do usuário',
      },
      async handler(request, reply) {
        const userId = await request.getCurrentUserId()

        const barbershops = await prisma.barbershop.findMany({
          where: {
            userId,
          },
          select: {
            id: true,
            name: true,
          },
        })

        reply.send(barbershops)
      },
    })
}
