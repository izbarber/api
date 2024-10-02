import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { NotFoundException } from '@/http/errors/not-found-exception'
import { prisma } from '@/lib/prisma'

export async function updateService(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PUT',
    url: '/barbershops/:barbershopId/services/:serviceId',
    schema: {
      tags: ['Serviços'],
      summary: 'Atualizar serviço',
      params: z.object({
        barbershopId: z.string().uuid(),
        serviceId: z.string().uuid(),
      }),
      body: z.object({
        name: z.string().min(1, { message: 'O nome é obrigatório' }),
        durationInMinutes: z
          .number()
          .int({ message: 'A duração deve ser um número inteiro' })
          .min(1, { message: 'A duração deve ser de pelo menos 1 minuto' }),
        price: z
          .number()
          .min(0, { message: 'O preço deve ser um valor positivo' }),
        categoryId: z.string().uuid({ message: 'ID de categoria inválido' }),
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

      const { name, categoryId, durationInMinutes, price } = request.body

      await prisma.service.update({
        where: {
          id: service.id,
        },
        data: {
          name,
          durationInMinutes,
          price,
          categoryId,
        },
      })

      reply.status(201).send()
    },
  })
}
