import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { createAppointment } from './routes/appointment/create-appointment'
import { getMyBarbershops } from './routes/auth/get-my-barbershops'
import { getProfile } from './routes/auth/get-profile'
import { signIn } from './routes/auth/sign-in'
import { signUpBarbershop } from './routes/auth/sign-up-barbershop'
import { createWeeklyBarberSchedule } from './routes/barber-schedule/create-weekly-barber-schedule'
import { getBarberSchedule } from './routes/barber-schedule/get-barber-schedule'
import { getBarbershopBySlug } from './routes/barbershop/get-barbershop-by-slug'
import { createCategory } from './routes/category/create-category'
import { deleteCategory } from './routes/category/delete-category'
import { getCategories } from './routes/category/get-categories'
import { updateCategory } from './routes/category/update-category'
import { createMember } from './routes/member/create-member'
import { deleteMember } from './routes/member/delete-member'
import { getMembers } from './routes/member/get-members'
import { createService } from './routes/services/create-service'
import { deleteService } from './routes/services/delete-service'
import { getServices } from './routes/services/get-services'
import { updateService } from './routes/services/update-service'

const app = fastify()

app.register(fastifyJwt, {
  secret: 'supersecret',
})

app.setErrorHandler(errorHandler)

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API - Izibarber',
      description: 'Aplicação de gestão de barbearias',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(signIn)
app.register(getMyBarbershops)
app.register(getProfile)
app.register(signUpBarbershop)

app.register(getCategories)
app.register(createCategory)
app.register(deleteCategory)
app.register(updateCategory)

app.register(getServices)
app.register(createService)
app.register(deleteService)
app.register(updateService)

app.register(createWeeklyBarberSchedule)
app.register(getBarberSchedule)

app.register(createMember)
app.register(deleteMember)
app.register(getMembers)

app.register(createAppointment)

app.register(getBarbershopBySlug)

app.listen({ port: 3333 }).then(() => {
  console.log('🚀 API is running at http://localhost:3333')
})
