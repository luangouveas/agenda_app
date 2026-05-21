import Fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { authRoutes } from './modules/auth/auth.routes'

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    },
  }).withTypeProvider<ZodTypeProvider>()
  
  app.setSerializerCompiler(serializerCompiler)
  app.setValidatorCompiler(validatorCompiler)
  
  // ─── Plugins ──────────────────────────────────────────────────────────────
  await app.register(helmet, { global: true })
  
  await app.register(cors, {
    origin: [
      process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3000',
      process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3002',
    ],
    credentials: true,
  })

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? 'dev_secret_change_in_production',
    sign: { expiresIn: process.env.JWT_EXPIRES_IN ?? '15m' },
  })

  await app.register(swagger, {
    openapi: {
      openapi: '3.1.1',
      info: {
        title: 'Minha Agenda API',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  })

  await app.register(swaggerUi, {
    routePrefix: `/docs`,
  })

  // ─── Health check ─────────────────────────────────────────────────────────
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  // ─── Rotas ────────────────────────────────────────────────────────────────
  await app.register(authRoutes, { prefix: '/auth' })

  // ─── Graceful shutdown ────────────────────────────────────────────────────
  const signals = ['SIGTERM', 'SIGINT'] as const
  for (const signal of signals) {
    process.on(signal, async () => {
      await app.close()
      //await prisma.$disconnect()
      process.exit(0)
    })
  }

  return app
}