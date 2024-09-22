import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

import { ConflictException } from './errors/conflict-exception'
import { NotFoundException } from './errors/not-found-exception'
import { UnauthorizedException } from './errors/unauthorized-exception'
import { UnprocessableEntityExeception } from './errors/unprocessable-entity-exception'

export const errorHandler: FastifyInstance['errorHandler'] = (
  error,
  request,
  reply,
) => {
  console.log(error)
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Erro de validação',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof UnauthorizedException) {
    return reply.status(401).send({ message: error.message })
  }

  if (error instanceof ConflictException) {
    return reply.status(409).send({ message: error.message })
  }

  if (error instanceof NotFoundException) {
    return reply.status(404).send({ message: error.message })
  }

  if (error instanceof UnprocessableEntityExeception) {
    return reply.status(422).send({ message: error.message })
  }

  console.log(error)

  return reply.status(500).send({ message: 'Erro interno no servidor' })
}
