import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { NotFoundException } from '@/http/errors/not-found-exception'
import { prisma } from '@/lib/prisma'

export async function createCategory(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/categories',
    schema: {
      tags: ['Categorias'],
      summary: 'Criar nova categoria',
      headers: z.object({
        'x-barbershop-id': z.string().uuid(),
      }),
      body: z.object({
        name: z
          .string()
          .min(3, { message: 'A categoria deve ter pelo menos 3 caracteres' }),
      }),
    },
    async handler(request, reply) {
      const { 'x-barbershop-id': barbershopId } = request.headers

      const barbershop = await prisma.barbershop.findUnique({
        where: {
          id: barbershopId as string,
        },
      })

      if (!barbershop) {
        throw new NotFoundException('Barbearia não encontrada')
      }

      const { name } = request.body

      await prisma.category.create({
        data: {
          name,
          barbershopId: barbershop.id,
        },
      })

      reply.status(201).send()
    },
  })
}
