import { FastifyInstance } from 'fastify'
import { loginEmailSchema, loginPhoneSchema, refreshTokenSchema, registerClientSchema } from '@agenda/shared'

export async function authRoutes(app: FastifyInstance) {
    // Login por email (proprietário, admin, colaborador — via painel admin)
  app.post('/login', {
    schema: { body: loginEmailSchema },
    handler: async (request, reply) => {
      //const tokens = await authService.loginWithEmail(request.body as any)
      return reply.status(200).send()
    },
  })

}