import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { ConflictException } from '@/http/errors/conflict-exception'
import { NotFoundException } from '@/http/errors/not-found-exception'
import { customDayjs } from '@/lib/dayjs'
import { prisma } from '@/lib/prisma'

export async function createAppointment(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/barbershops/:barbershopId/appointments',
    schema: {
      tags: ['Agendamentos'],
      summary: 'Criar agendamento',
      params: z.object({
        barbershopId: z.string().uuid(),
      }),
      body: z.object({
        customerName: z
          .string()
          .min(1, { message: 'Nome do cliente é obrigatório' }),
        customerEmail: z
          .string()
          .email({ message: 'Formato de e-mail inválido' })
          .optional(),
        customerPhone: z
          .string()
          .min(8, { message: 'O telefone deve ter no mínimo 8 caracteres' }),
        appointmentTime: z.coerce.date(),
        barberId: z.string().uuid(),
        serviceId: z.string().uuid(),
      }),
    },
    async handler(request, reply) {
      const { barbershopId } = request.params
      const {
        barberId,
        serviceId,
        appointmentTime,
        customerName,
        customerPhone,
        customerEmail,
      } = request.body

      const barbershop = await prisma.barbershop.findUnique({
        where: {
          id: barbershopId,
        },
      })

      if (!barbershop) {
        throw new NotFoundException('Barbearia não encontrada')
      }

      const appointmentStartTime = customDayjs(appointmentTime)

      const barber = await prisma.member.findUnique({
        where: {
          id: barberId,
        },
      })

      if (!barber) {
        throw new NotFoundException('Barbeiro não encontrada')
      }

      const service = await prisma.service.findUnique({
        where: {
          id: serviceId,
        },
      })

      if (!service) {
        throw new NotFoundException(
          'O serviço que você tentou agendar não existe',
        )
      }

      const appointmentEndTime = appointmentStartTime.add(
        service.durationInMinutes,
        'minute',
      )

      const conflictingAppointments = await prisma.appointment.findMany({
        where: {
          barberId,
          appointmentTime: {
            gte: appointmentStartTime.toDate(),
            lt: appointmentEndTime.toDate(),
          },
        },
      })

      if (conflictingAppointments.length > 0) {
        throw new ConflictException(
          'Barbeiro já tem um agendamento nesse horário',
        )
      }

      const customer = await prisma.customer.create({
        data: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
      })

      const appointment = await prisma.appointment.create({
        data: {
          appointmentTime: appointmentStartTime.toDate(),
          serviceId,
          barberId,
          customerId: customer.id,
        },
      })

      console.log(
        `Agendamento confirmado para ${customerPhone} às ${appointmentTime}`,
      )

      reply.status(200).send({ appointment })
    },
  })
}
