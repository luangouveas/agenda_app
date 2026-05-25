# CLAUDE.md — @agenda/api

## Responsabilidade

API REST do sistema de agendamentos. Recebe requisições HTTP, valida com Zod, executa lógica de negócio e retorna respostas tipadas. Todos os schemas de rota alimentam o Swagger automaticamente via `fastify-type-provider-zod`.

## Estrutura de Arquivos

```
src/
├── app.ts                          # buildApp() — registra plugins e rotas
├── server.ts                       # Entry point — listen + dotenv
└── modules/
    └── auth/
        └── auth.routes.ts          # Rotas de auth (handlers a implementar)
```

Padrão esperado para novos módulos:

```
src/modules/<nome>/
├── <nome>.routes.ts    # Rotas Fastify com schemas Zod
├── <nome>.service.ts   # Lógica de negócio (recebe prisma como parâmetro)
└── <nome>.schema.ts    # Schemas Zod locais (se não forem compartilhados)
```

## Como Adicionar uma Rota

```typescript
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function exemploRoutes(app: FastifyInstance) {
  app.post('/exemplo', {
    schema: {
      body: z.object({ campo: z.string() }),
      response: { 200: z.object({ ok: z.boolean() }) },
    },
    handler: async (request, reply) => {
      return reply.status(200).send({ ok: true })
    },
  })
}
```

Registrar em `app.ts`:

```typescript
await app.register(exemploRoutes, { prefix: '/exemplo' })
```

## Autenticação JWT

O plugin `@fastify/jwt` já está registrado. Para proteger uma rota, adicionar o hook `onRequest`:

```typescript
app.addHook('onRequest', app.authenticate) // decorador a implementar
```

O payload do token segue a interface `JwtPayload` de `@agenda/shared/types`. O campo `phone` é obrigatório no payload; `email` é opcional.

## Validação

- Sempre usar schemas de `@agenda/shared/validators` quando o contrato é compartilhado (ex.: login, cadastro)
- Schemas puramente internos à rota ficam em `<nome>.schema.ts` local
- Nunca validar manualmente com `if`/`throw` o que um schema Zod já cobre

## Variáveis de Ambiente

| Variável | Padrão | Obrigatório |
|----------|--------|-------------|
| `API_PORT` | `3001` | Não |
| `API_HOST` | `0.0.0.0` | Não |
| `DATABASE_URL` | — | Sim |
| `JWT_SECRET` | `dev_secret_change_in_production` | Prod |
| `JWT_EXPIRES_IN` | `15m` | Não |
| `NEXT_PUBLIC_ADMIN_URL` | `http://localhost:3000` | Não |
| `NEXT_PUBLIC_WEB_URL` | `http://localhost:3002` | Não |

## Estado Atual

- [x] Plugins configurados (helmet, cors, rate-limit, jwt, swagger)
- [x] Health check (`GET /health`)
- [x] Rota `POST /auth/login` declarada com schema
- [ ] Handler de `POST /auth/login` implementado
- [ ] Middleware de autenticação (`app.authenticate`)
- [ ] Demais rotas de auth (phone login, refresh, register)
- [ ] Módulo de agendamentos

## Comandos

```bash
pnpm dev      # tsx watch src/server.ts
pnpm build    # tsc → dist/
pnpm start    # node dist/server.js
pnpm test     # vitest run
```

Swagger disponível em `http://localhost:3001/docs` com o servidor rodando.
