import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { NotFoundException } from '@/http/errors/not-found-exception'
import { prisma } from '@/lib/prisma'

export async function createService(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/services',
    schema: {
      tags: ['Serviços'],
      summary: 'Criação de serviço',
      headers: z.object({
        'x-barbershop-id': z.string().uuid(),
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
        // available: z.boolean().default(false),
        categoryId: z.string().uuid({ message: 'ID de categoria inválido' }),
        // image: z
        //   .any()
        //   .refine((file) => file && file.mimetype.startsWith('image/'), {
        //     message: 'Um arquivo de imagem válido é obrigatório',
        //   }),
      }),
    },
    async handler(request, reply) {
      const { 'x-barbershop-id': barbershopId } = request.headers

      const barbershop = await prisma.barbershop.findUnique({
        where: {
          id: barbershopId,
        },
      })

      if (!barbershop) {
        throw new NotFoundException('Barbearia não encontrada')
      }

      const { name, price, durationInMinutes, categoryId } = request.body

      await prisma.service.create({
        data: {
          name,
          price,
          // available,
          durationInMinutes,
          barbershopId,
          categoryId,
        },
      })

      return reply.status(200).send()
    },
  })
}
