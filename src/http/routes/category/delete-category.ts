import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { NotFoundException } from '@/http/errors/not-found-exception'
import { UnprocessableEntityExeception } from '@/http/errors/unprocessable-entity-exception'
import { prisma } from '@/lib/prisma'

export async function deleteCategory(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/categories/:categoryId',
    schema: {
      tags: ['Categorias'],
      summary: 'Deletar categoria',
      headers: z.object({
        'x-barbershop-id': z.string().uuid(),
      }),
      params: z.object({
        categoryId: z.string().uuid(),
      }),
    },
    async handler(request, reply) {
      const { 'x-barbershop-id': barbershopId } = request.headers
      const { categoryId } = request.params

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

      const isCategoryInUse = await prisma.service.findFirst({
        where: {
          categories: {
            some: {
              id: categoryId,
            },
          },
        },
      })

      if (isCategoryInUse) {
        throw new UnprocessableEntityExeception(
          'Não é possível excluir uma categoria que está vinculada há um serviço',
        )
      }

      console.log('hello', isCategoryInUse)
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
