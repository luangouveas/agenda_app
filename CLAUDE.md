# CLAUDE.md — Agenda App

Guia de contexto para o assistente de IA neste monorepo.

## Visão Geral do Projeto

Sistema de agendamentos multi-tenant em estágio inicial (MVP). O schema do banco e o esqueleto da API estão prontos; a lógica de negócio (handlers, serviços, middlewares) ainda será implementada.

## Estrutura de Pacotes

```
apps/api/          @agenda/api      — API Fastify, porta 3001
apps/web/          @agenda/web      — Frontend (vazio, a implementar)
packages/database/ @agenda/database — Prisma + PostgreSQL
packages/shared/   @agenda/shared   — Tipos e validadores Zod
```

## Convenções de Código

- **TypeScript strict** em todos os pacotes — sem `any` sem justificativa explícita
- **Zod 4** para validação de entrada na API; schemas definidos em `@agenda/shared`
- **Sem ponto-e-vírgula**, aspas simples, largura de linha 120 (ver `.prettierrc`)
- Mensagens de erro ao usuário em **português**
- Cada módulo da API segue a estrutura `src/modules/<nome>/`:
  - `<nome>.routes.ts` — definição de rotas Fastify
  - `<nome>.service.ts` — lógica de negócio (a criar)
  - `<nome>.schema.ts` — schemas Zod locais (se não for compartilhado)

## Decisões Arquiteturais

- **Multi-tenant via `UserCompanyRole`**: usuários podem ter papéis distintos em empresas distintas; o contexto da empresa deve ser propagado via JWT payload (`CompanyContext` em `@agenda/shared`).
- **Fastify + `fastify-type-provider-zod`**: todas as rotas devem declarar schemas Zod para request/response; isso alimenta a geração automática do Swagger.
- **Prisma com `@prisma/adapter-pg`**: usar o adapter nativo do PostgreSQL em vez do driver padrão para melhor performance.
- **`@agenda/shared` como fonte da verdade**: enums, tipos e validadores reutilizados entre `api` e `web` vivem neste pacote — não duplicar.

## Fluxo de Desenvolvimento

1. Alterações no schema Prisma → rodar `pnpm db:migrate` e depois `pnpm db:generate`
2. Novos tipos compartilhados → adicionar em `packages/shared/src/`
3. Build incremental via Turborepo — `pnpm build` respeita o grafo de dependências
4. Rodar `pnpm check-types` antes de commits para garantir consistência de tipos

## Scripts Principais

```bash
pnpm dev              # watch em todos os pacotes
pnpm build            # build completo (respeita ordem de dependências)
pnpm db:migrate       # migrations Prisma (dev)
pnpm db:generate      # regenera o Prisma Client após mudanças no schema
pnpm db:seed          # dados de teste (empresa + usuários padrão)
pnpm db:studio        # Prisma Studio na porta padrão
pnpm check-types      # tsc --noEmit em todos os pacotes
```

## Dados de Teste (Seed)

| Campo | Valor |
|-------|-------|
| Empresa | Empresa Teste 01 |
| Owner — telefone | 21968243286 |
| Owner — senha | 123456 |
| Cliente — telefone | 21999999999 |
| Cliente — senha | cliente123 |

## O Que Ainda Não Foi Implementado

- Handlers das rotas de autenticação (`apps/api/src/modules/auth/`)
- Middleware de autenticação JWT
- Módulo de agendamentos (schema existe, rota não)
- Frontend (`apps/web/`)
- Testes automatizados
- CI/CD
