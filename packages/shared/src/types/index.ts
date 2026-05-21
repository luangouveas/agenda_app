export type RoleName = 'OWNER' | 'ADMIN' | 'COLLABORATOR'

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'

export type RecurrenceType = 'DAILY' | 'WEEKLY' | 'MONTHLY'

export type NotificationChannel = 'WHATSAPP' | 'EMAIL' | 'PUSH'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub: string // userId
  email?: string
  phone: string
  iat: number
  exp: number
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

// ─── Contexto de empresa no request ─────────────────────────────────────────

export interface CompanyContext {
  companyId: string
  companySlug: string
  roleName: RoleName
}

// ─── Respostas paginadas ──────────────────────────────────────────────────────

export interface Paginated<T> {
  data: T[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export interface PaginationParams {
  page?: number
  perPage?: number
}

// ─── Slots de disponibilidade ─────────────────────────────────────────────────

export interface AvailableSlot {
  startsAt: string // ISO string
  endsAt: string   // ISO string
}
