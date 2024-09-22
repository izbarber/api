import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { NotFoundException } from '@/http/errors/not-found-exception'
import { prisma } from '@/lib/prisma'

export async function updateCategory(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PUT',
    url: '/categories/:categoryId',
    schema: {
      tags: ['Categorias'],
      summary: 'Atualizar categoria',
      headers: z.object({
        'x-barbershop-id': z.string().uuid(),
      }),
      params: z.object({
        categoryId: z.string().uuid(),
      }),
      body: z.object({
        name: z
          .string()
          .min(3, { message: 'A categoria deve ter pelo menos 3 caracteres' }),
      }),
    },
    async handler(request, reply) {
      const { categoryId } = request.params
      const { 'x-barbershop-id': barbershopId } = request.headers

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

      const { name } = request.body

      await prisma.category.update({
        where: {
          id: categoryId,
        },
        data: {
          name,
          barbershopId: barbershop.id,
        },
      })

      reply.status(201).send()
    },
  })
}
