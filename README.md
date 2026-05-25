# Agenda App

Sistema de gestão de agendamentos multi-tenant, construído como monorepo com pnpm workspaces e Turborepo.

## Visão Geral

O Agenda App permite que empresas gerenciem agendamentos com seus clientes. A arquitetura multi-tenant suporta múltiplas empresas na mesma instância, com usuários podendo ter papéis diferentes em cada empresa.

## Estrutura do Monorepo

```
agenda_app/
├── apps/
│   ├── api/          # API REST (Fastify)
│   └── web/          # Frontend web (em desenvolvimento)
└── packages/
    ├── database/     # Prisma ORM + schema PostgreSQL
    └── shared/       # Tipos TypeScript e validadores Zod compartilhados
```

## Pré-requisitos

- Node.js >= 20
- pnpm >= 9
- PostgreSQL

## Instalação

```bash
pnpm install
```

## Configuração

Copie o `.env.example` de cada app/pacote relevante e configure as variáveis:

```bash
# apps/api
cp apps/api/.env.example apps/api/.env

# packages/database
cp packages/database/.env.example packages/database/.env
```

Variáveis necessárias em `packages/database/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/agenda_app"
```

Variáveis necessárias em `apps/api/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/agenda_app"
JWT_SECRET="seu-secret-aqui"
API_PORT=3001
ADMIN_URL="http://localhost:3000"
WEB_URL="http://localhost:3001"
```

## Comandos

### Desenvolvimento

```bash
pnpm dev          # Inicia todos os pacotes em modo watch
```

### Build

```bash
pnpm build        # Compila todos os pacotes
```

### Banco de Dados

```bash
pnpm db:generate  # Gera o Prisma Client
pnpm db:migrate   # Executa as migrations (dev)
pnpm db:seed      # Popula dados de teste
pnpm db:studio    # Abre o Prisma Studio
```

### Qualidade de Código

```bash
pnpm lint         # ESLint em todos os pacotes
pnpm format       # Prettier em todos os pacotes
pnpm check-types  # Verificação de tipos TypeScript
```

## Pacotes

| Pacote | Versão | Descrição |
|--------|--------|-----------|
| [`@agenda/api`](apps/api/README.md) | `0.1.0` | API REST com Fastify |
| [`@agenda/database`](packages/database/README.md) | `0.1.0` | Camada de banco de dados com Prisma |
| [`@agenda/shared`](packages/shared/README.md) | `0.1.0` | Tipos e validadores compartilhados |

## Stack Tecnológica

| Categoria | Tecnologia |
|-----------|------------|
| Runtime | Node.js 20+ |
| Linguagem | TypeScript (strict) |
| Gerenciador de pacotes | pnpm 9 |
| Build orchestration | Turborepo |
| API Framework | Fastify 5 |
| ORM | Prisma 7 |
| Banco de dados | PostgreSQL |
| Validação | Zod 4 |
| Autenticação | JWT |
| Testes | Vitest |

## Arquitetura

O sistema é organizado em torno de três conceitos principais:

- **Company**: unidade tenant. Cada empresa é um espaço isolado de dados.
- **User**: usuário autenticado que pode pertencer a múltiplas empresas com papéis diferentes.
- **Appointment**: agendamento entre um colaborador e um cliente (a ser implementado).

Os papéis disponíveis por empresa são `OWNER`, `ADMIN` e `COLLABORATOR`.
