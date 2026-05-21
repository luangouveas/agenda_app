import 'dotenv/config'
import { buildApp } from './app'

const start = async () => {
  const app = await buildApp()

  await app.listen({
    port: Number(process.env.API_PORT ?? 3001),
    host: process.env.API_HOST ?? '0.0.0.0',
  })
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
