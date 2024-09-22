import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

export async function getMembers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/barbershops/:barbershopId/members',
    schema: {
      tags: ['Membros'],
      summary: 'Listar membros da barbearia',
      params: z.object({
        barbershopId: z.string().uuid(),
      }),
    },
    async handler(request, reply) {
      const { barbershopId } = request.params

      const members = await prisma.member.findMany({
        where: {
          barbershopId,
        },
      })

      reply.status(200).send({ members })
    },
  })
}
