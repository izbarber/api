import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { NotFoundException } from '@/http/errors/not-found-exception'
import { prisma } from '@/lib/prisma'

export async function deleteCategory(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/barbershops/:barbershopId/categories/:categoryId',
    schema: {
      tags: ['Categorias'],
      summary: 'Deletar categoria',
      params: z.object({
        barbershopId: z.string().uuid(),
        categoryId: z.string().uuid(),
      }),
    },
    async handler(request, reply) {
      const { barbershopId, categoryId } = request.params

      const barbershop = await prisma.barbershop.findUnique({
        where: {
          id: barbershopId,
        },
      })

      if (!barbershop) {
        throw new NotFoundException('Barbearia não encontrada')
      }

      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      })

      if (!category) {
        throw new NotFoundException('Categoria não encontrada')
      }

      await prisma.category.delete({
        where: {
          id: categoryId,
        },
      })

      reply.status(202).send()
    },
  })
}
