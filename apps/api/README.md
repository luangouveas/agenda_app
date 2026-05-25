# @agenda/api

API REST do sistema de agendamentos, construída com Fastify 5 e TypeScript.

## Responsabilidade

Expõe endpoints HTTP para autenticação, gestão de usuários, empresas e agendamentos. Toda validação de entrada é feita com Zod, e os schemas alimentam a documentação OpenAPI gerada automaticamente.

## Stack

| Tecnologia | Uso |
|------------|-----|
| Fastify 5 | Framework HTTP |
| `fastify-type-provider-zod` | Tipagem de rotas via Zod |
| `@fastify/jwt` | Autenticação JWT |
| `@fastify/swagger` + `@fastify/swagger-ui` | Documentação OpenAPI |
| `@fastify/cors` + `@fastify/helmet` | Segurança HTTP |
| `@fastify/rate-limit` | Rate limiting (100 req/min) |
| Vitest | Testes |

## Estrutura

```
src/
├── app.ts              # Configuração do servidor Fastify (plugins, rotas)
├── server.ts           # Entry point — bind e graceful shutdown
└── modules/
    └── auth/
        └── auth.routes.ts   # Rotas de autenticação (handlers a implementar)
```

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `API_PORT` | `3001` | Porta do servidor |
| `DATABASE_URL` | — | Connection string PostgreSQL |
| `JWT_SECRET` | — | Secret para assinar tokens JWT |
| `JWT_EXPIRES_IN` | `15m` | Expiração do access token |
| `ADMIN_URL` | — | Origin permitida pelo CORS (painel admin) |
| `WEB_URL` | — | Origin permitida pelo CORS (web) |

## Comandos

```bash
pnpm dev      # Inicia em modo watch (tsx)
pnpm build    # Compila para dist/
pnpm start    # Executa dist/server.js
pnpm lint     # ESLint
pnpm test     # Vitest
```

## Endpoints

### Implementados

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Health check |

### Esqueleto (handlers vazios)

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/auth/login` | Login por e-mail e senha |

### A implementar

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/auth/login/phone` | Login por telefone e senha |
| `POST` | `/auth/refresh` | Renovar access token |
| `POST` | `/auth/register` | Cadastro de cliente |

## Documentação OpenAPI

Com o servidor rodando, acesse:

```
http://localhost:3001/docs
```

A interface Swagger UI é gerada automaticamente a partir dos schemas Zod declarados nas rotas.

## Decisões de Design

- Rotas utilizam `fastify-type-provider-zod` para garantir que validação de runtime e tipagem estática sejam derivadas da mesma fonte (o schema Zod).
- O `CompanyContext` injetado no JWT payload identifica a empresa ativa do usuário — necessário para isolar dados no contexto multi-tenant.
- Rate limiting configurado a 100 requisições por minuto por IP.
