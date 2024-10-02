import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { NotFoundException } from '@/http/errors/not-found-exception'
import { prisma } from '@/lib/prisma'

export async function getServices(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/barbershops/:barbershopId/services',
    schema: {
      tags: ['Serviços'],
      summary: 'Listagem de serviços',
      params: z.object({
        barbershopId: z.string().uuid(),
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

      const services = await prisma.service.findMany({
        where: {
          barbershopId,
        },
        select: {
          id: true,
          price: true,
          name: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      reply.status(200).send({ services })
    },
  })
}
