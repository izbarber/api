import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { NotFoundException } from '@/http/errors/not-found-exception'
import { prisma } from '@/lib/prisma'

export async function getCategories(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/categories',
    schema: {
      tags: ['Categorias'],
      summary: 'Listar categorias',
      headers: z.object({
        'x-barbershop-id': z.string().uuid(),
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

      const categories = await prisma.category.findMany({
        where: {
          barbershopId,
        },
      })

      reply.status(200).send(categories)
    },
  })
}
