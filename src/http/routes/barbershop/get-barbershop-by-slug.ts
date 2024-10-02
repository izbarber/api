import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { NotFoundException } from '@/http/errors/not-found-exception'
import { prisma } from '@/lib/prisma'

export async function getBarbershopBySlug(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/barbershops/:barbershopSlug',
    schema: {
      tags: ['Barbearia'],
      summary: 'Obter dados da barbearia pelo slug',
      params: z.object({
        barbershopSlug: z.string(),
      }),
    },
    async handler(request, reply) {
      const { barbershopSlug } = request.params

      const barbershop = await prisma.barbershop.findUnique({
        where: {
          id: barbershopSlug,
        },
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
          slug: true,
        },
      })

      if (!barbershop) {
        throw new NotFoundException('Barbearia não encontrada')
      }

      reply.send(barbershop)
    },
  })
}
