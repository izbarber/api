import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { NotFoundException } from '@/http/errors/not-found-exception'
import { prisma } from '@/lib/prisma'

export async function deleteMember(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/barbershops/:barbershopId/members/:memberId',
    schema: {
      tags: ['Membros'],
      summary: 'Excluir membro da barbearia',
      params: z.object({
        barbershopId: z.string().uuid(),
        memberId: z.string().uuid(),
      }),
    },
    async handler(request, reply) {
      const { barbershopId, memberId } = request.params

      const barbershop = await prisma.barbershop.findUnique({
        where: {
          id: barbershopId,
        },
      })

      if (!barbershop) {
        throw new NotFoundException('Barbearia não encontrada')
      }

      const member = await prisma.member.findFirst({
        where: {
          AND: {
            id: memberId,
            barbershopId,
          },
        },
      })

      if (!member) {
        throw new NotFoundException(
          'Este membro não existe ou não está vinculado a barbearia informada',
        )
      }

      await prisma.member.delete({
        where: {
          id: memberId,
        },
      })

      reply.status(202).send()
    },
  })
}
