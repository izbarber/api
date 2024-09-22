import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

export async function getBarberSchedule(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/barbershops/:barbershopId/barbers/:barberId',
    schema: {
      tags: ['Agenda'],
      summary: 'Retorna uma lista de horários do barbeiro',
      params: z.object({
        barbershopId: z.string().uuid(),
        barberId: z.string().uuid(),
      }),
    },
    async handler(request, reply) {
      const { barberId } = request.params

      const barberSchedule = await prisma.barberSchedule.findMany({
        where: {
          barberId,
          available: true,
        },
        orderBy: {
          dayOfWeek: 'asc',
        },
        include: {
          breaks: {
            orderBy: {
              startTime: 'asc',
            },
          },
        },
      })

      reply.status(200).send({ agenda: barberSchedule })
    },
  })
}
