import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { NotFoundException } from '@/http/errors/not-found-exception'
import { prisma } from '@/lib/prisma'

export async function deleteService(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/barbershops/:barbershopId/services/:serviceId',
    schema: {
      tags: ['Serviços'],
      summary: 'Deletar serviço',
      params: z.object({
        barbershopId: z.string().uuid(),
        serviceId: z.string().uuid(),
      }),
    },
    async handler(request, reply) {
      const { barbershopId, serviceId } = request.params

      const barbershop = await prisma.barbershop.findUnique({
        where: {
          id: barbershopId,
        },
      })

      if (!barbershop) {
        throw new NotFoundException('Barbearia não encontrada')
      }

      const service = await prisma.service.findUnique({
        where: {
          id: serviceId,
        },
      })

      if (!service) {
        throw new NotFoundException('Serviço não encontrado')
      }

      await prisma.service.delete({
        where: {
          id: service.id,
        },
      })

      reply.status(202).send()
    },
  })
}
