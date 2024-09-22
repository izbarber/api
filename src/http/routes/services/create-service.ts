import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { NotFoundException } from '@/http/errors/not-found-exception'
import { prisma } from '@/lib/prisma'

export async function createService(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/barbershops/:barbershopId/services',
    schema: {
      tags: ['Serviços'],
      summary: 'Criação de serviço',
      params: z.object({
        barbershopId: z.string().uuid(),
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
        available: z.boolean().default(false),
        categoryIds: z
          .array(z.string().uuid({ message: 'ID de categoria inválido' }))
          .nonempty({
            message:
              'O serviço deve estar associado a pelo menos uma categoria.',
          }),
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

      const { name, price, available, durationInMinutes, categoryIds } =
        request.body

      await prisma.service.create({
        data: {
          name,
          price,
          available,
          durationInMinutes,
          barbershopId,
          categories: {
            connect: categoryIds.map((categoryId) => ({ id: categoryId })),
          },
        },
      })

      return reply.status(200).send()
    },
  })
}
