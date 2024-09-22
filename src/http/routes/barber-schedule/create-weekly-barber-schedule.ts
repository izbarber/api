import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { NotFoundException } from '@/http/errors/not-found-exception'
import { customDayjs } from '@/lib/dayjs'
import { prisma } from '@/lib/prisma'

export async function createWeeklyBarberSchedule(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/barbershops/:barbershopId/barbers/:barberId/schedule',
    schema: {
      tags: ['Agenda'],
      summary: 'Criar agenda do barbeiro para a semana',
      params: z.object({
        barbershopId: z.string().uuid(),
        barberId: z.string().uuid(),
      }),
      body: z.object({
        barberSchedules: z.array(
          z
            .object({
              dayOfWeek: z.coerce
                .number()
                .int()
                .min(0, { message: 'Dia da semana precisa estar entre 0 e 6' })
                .max(6, { message: 'Dia da semana precisa estar entre 0 e 6' }),
              startTime: z.coerce.date(),
              endTime: z.coerce.date(),
              available: z.boolean().default(true),
              breaks: z.array(
                z
                  .object({
                    startTime: z.coerce.date(),
                    endTime: z.coerce.date(),
                    // repeat: z.boolean().default(false),
                    // repeatDays: z.array(z.coerce.number()),
                  })
                  .refine(
                    (data) =>
                      customDayjs(data.startTime).isBefore(data.endTime),
                    {
                      message:
                        'Data de início não pode ser igual ou superior a data de término',
                      path: ['startTime'],
                    },
                  ),
              ),
            })
            .refine(
              (data) => customDayjs(data.startTime).isBefore(data.endTime),
              {
                message:
                  'Data de início não pode ser igual ou superior a data de término',
                path: ['startTime'],
              },
            ),
        ),
      }),
    },
    async handler(request, reply) {
      const { barbershopId, barberId } = request.params
      const { barberSchedules } = request.body

      const barbershop = await prisma.barbershop.findUnique({
        where: {
          id: barbershopId,
        },
      })

      if (!barbershop) {
        throw new NotFoundException('Barbearia não encontrada')
      }

      const barber = await prisma.member.findUnique({
        where: {
          id: barberId,
        },
      })

      if (!barber) {
        throw new NotFoundException('Barbeiro não encontrado')
      }

      // TODO: Vou precisar obter o token do usuário logado e verificar se ele é membro e se possui permissões para inserir horário do barbeiro, a ideia é que somente ADMIN e o barbeiro em si consiga manipular suas informações

      await Promise.all(
        barberSchedules.map(
          async ({ available, breaks, dayOfWeek, endTime, startTime }) => {
            return prisma.barberSchedule.create({
              data: {
                available,
                dayOfWeek,
                endTime,
                startTime,
                barberId,
                breaks: {
                  createMany: {
                    data: breaks.map(({ startTime, endTime }) => ({
                      startTime,
                      endTime,
                    })),
                  },
                },
              },
            })
          },
        ),
      )
      // await prisma.barberSchedule.createMany({
      //   data: barberSchedules.map(
      //     ({ available, breaks, dayOfWeek, endTime, startTime }) => ({
      //       dayOfWeek,
      //       available,
      //       startTime,
      //       endTime,
      //       barberId,
      //       breaks: {
      //         createMany: {
      //           data: breaks.map(
      //             ({ startTime, endTime, repeat, repeatDays }) => ({
      //               startTime,
      //               endTime,
      //               repeat,
      //               repeatDays: repeat ? repeatDays : undefined,
      //             }),
      //           ),
      //         },
      //       },
      //     }),
      //   ),
      // })

      reply.status(201).send()
    },
  })
}
