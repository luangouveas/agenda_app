import { z } from 'zod'

export const loginEmailSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

export const loginPhoneSchema = z.object({
  phone: z.string().min(10, 'Telefone inválido').max(15),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
})

export const registerClientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  phone: z.string().min(10, 'Telefone inválido').max(15),
  password: z.string().min(6).max(100),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6).max(100),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

export type LoginEmailInput = z.infer<typeof loginEmailSchema>
export type LoginPhoneInput = z.infer<typeof loginPhoneSchema>
export type RegisterClientInput = z.infer<typeof registerClientSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
