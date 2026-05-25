# @agenda/database

Camada de persistência do sistema. Gerencia o schema PostgreSQL via Prisma ORM e exporta o cliente configurado para uso pelos demais pacotes.

## Responsabilidade

- Definir e versionar o schema do banco via migrations Prisma
- Exportar o `PrismaClient` configurado com o adapter nativo do PostgreSQL
- Fornecer utilitários de hash de senha (`bcryptjs`)
- Manter o script de seed com dados de teste

## Stack

| Tecnologia | Uso |
|------------|-----|
| Prisma 7 | ORM e migrations |
| `@prisma/adapter-pg` | Adapter nativo PostgreSQL |
| PostgreSQL | Banco de dados relacional |
| bcryptjs | Hash de senhas |

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL |

## Comandos

```bash
pnpm db:generate      # Gera o Prisma Client após mudanças no schema
pnpm db:migrate       # Cria e executa migration (desenvolvimento)
pnpm db:migrate:prod  # Executa migrations sem criação (produção)
pnpm db:push          # Sincroniza schema sem gerar migration (prototipagem)
pnpm db:seed          # Popula dados de teste
pnpm db:studio        # Abre o Prisma Studio
```

## Schema

### Modelos

#### `Company`
Representa uma empresa (tenant). Suporta soft delete via `deletedAt`.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `name` | String | Nome da empresa (único por instância ativa) |
| `deletedAt` | DateTime? | Soft delete |

#### `User`
Usuário autenticável. Pode pertencer a múltiplas empresas com papéis distintos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `name` | String | Nome completo |
| `email` | String? | E-mail único |
| `phone` | String? | Telefone único |
| `passwordHash` | String | Senha hasheada (bcrypt) |
| `deletedAt` | DateTime? | Soft delete |

#### `UserCompanyRole`
Junction table que associa usuários a empresas com um papel específico.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `userId` | UUID | Referência ao usuário |
| `companyId` | UUID | Referência à empresa |
| `role` | `RoleName` | Papel na empresa |

#### `RefreshToken`
Armazena tokens de refresh para controle de sessão.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `token` | String | Token JWT (único) |
| `userId` | UUID | Usuário dono do token |
| `expiresAt` | DateTime | Data de expiração |

### Enums

| Enum | Valores |
|------|---------|
| `RoleName` | `OWNER`, `ADMIN`, `COLLABORATOR` |
| `AppointmentStatus` | `PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `NO_SHOW` |
| `NotificationChannel` | `WHATSAPP`, `EMAIL`, `PUSH` |
| `NotificationStatus` | `QUEUED`, `SENT`, `DELIVERED`, `READ`, `FAILED` |
| `RecurrenceType` | `DAILY`, `WEEKLY`, `MONTHLY` |

> Os enums `AppointmentStatus`, `NotificationChannel`, `NotificationStatus` e `RecurrenceType` estão definidos no schema antecipando os próximos módulos, mas ainda não possuem modelos associados.

## Migrations

As migrations ficam em `prisma/migrations/`. Cada migration tem um diretório com timestamp e nome descritivo:

```
prisma/migrations/
├── 20250520000000_init/                    # Schema inicial
└── 20250520010000_add_indexes/             # Índices únicos
```

Sempre rode `pnpm db:generate` após qualquer alteração no `schema.prisma`.

## Seed

O script `src/seed.ts` cria:

| Recurso | Dados |
|---------|-------|
| Empresa | Empresa Teste 01 |
| Usuário OWNER | Luan Gouveas — telefone `21968243286` — senha `123456` |
| Usuário COLLABORATOR | Cliente 01 — telefone `21999999999` — senha `cliente123` |

Execute com:

```bash
pnpm db:seed
```
