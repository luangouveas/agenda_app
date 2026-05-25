# @agenda/shared

Tipos TypeScript e validadores Zod compartilhados entre os pacotes do monorepo.

## Responsabilidade

Ser a **fonte da verdade** para contratos de dados usados em mais de um pacote. Evita duplicação de enums, interfaces e schemas de validação entre `@agenda/api` e futuramente `@agenda/web`.

## Exports

O pacote expõe três entry points:

| Entry point | Importação | Conteúdo |
|-------------|------------|----------|
| Principal | `@agenda/shared` | Tudo |
| Tipos | `@agenda/shared/types` | Apenas interfaces TypeScript |
| Validadores | `@agenda/shared/validators` | Apenas schemas Zod |

## Tipos (`src/types/`)

### Enums

```typescript
RoleName            // OWNER | ADMIN | COLLABORATOR
AppointmentStatus   // PENDING | CONFIRMED | IN_PROGRESS | COMPLETED | CANCELLED | NO_SHOW
NotificationChannel // WHATSAPP | EMAIL | PUSH
NotificationStatus  // QUEUED | SENT | DELIVERED | READ | FAILED
RecurrenceType      // DAILY | WEEKLY | MONTHLY
```

### Interfaces

| Interface | Descrição |
|-----------|-----------|
| `JwtPayload` | Payload do access token JWT |
| `TokenPair` | Par `accessToken` + `refreshToken` |
| `CompanyContext` | Contexto da empresa ativa injetado no JWT |
| `Paginated<T>` | Wrapper genérico de paginação |
| `AvailableSlot` | Horário disponível para agendamento |

#### `JwtPayload`

```typescript
interface JwtPayload {
  sub: string           // userId
  company: CompanyContext
  iat?: number
  exp?: number
}
```

#### `CompanyContext`

```typescript
interface CompanyContext {
  id: string
  role: RoleName
}
```

## Validadores (`src/validators/`)

Todos os schemas usam mensagens de erro em português.

| Schema | Uso |
|--------|-----|
| `loginEmailSchema` | Login com e-mail e senha |
| `loginPhoneSchema` | Login com telefone e senha |
| `refreshTokenSchema` | Renovação de access token |
| `registerClientSchema` | Cadastro de novo cliente |
| `changePasswordSchema` | Troca de senha (com confirmação) |

## Como Usar

```typescript
// Importar tipos
import type { JwtPayload, TokenPair } from '@agenda/shared/types'

// Importar validadores
import { loginEmailSchema } from '@agenda/shared/validators'

// Importar tudo
import { loginEmailSchema, type JwtPayload } from '@agenda/shared'
```

## Adicionando Novos Exports

1. Criar o arquivo em `src/types/` ou `src/validators/`
2. Re-exportar em `src/types/index.ts` ou `src/validators/index.ts`
3. O entry point principal (`src/index.ts`) já re-exporta ambos automaticamente
4. Rodar `pnpm build` para recompilar antes de usar nos outros pacotes
