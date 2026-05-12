import { z } from 'zod'

/**
 * User settings stored server-side as JSONB.
 *
 * @remarks
 * Free-form by design — the backend doesn't validate the shape.
 *
 * @public
 */
export const userSettingsSchema = z.object({}).catchall(z.unknown())

/**
 * User role.
 *
 * @remarks
 * Mirrors the backend `role_enum`.
 *
 * @public
 */
export const roleSchema = z.enum(['admin', 'customer', 'super_admin'])

export type Role = z.infer<typeof roleSchema>

/**
 * Authentication provider used by the user.
 *
 * @remarks
 * Mirrors the backend `auth_provider_enum`.
 *
 * @public
 */
export const authProviderSchema = z.enum(['local', 'google', 'azure', 'apple'])

export type AuthProvider = z.infer<typeof authProviderSchema>

/**
 * Field-level validators — single source of truth for each user input
 * field's validation rules and French error messages.
 *
 * @remarks
 * `pseudoStrict` (3-50 chars) is for the register form. `pseudoLoose` (just
 * non-empty) is for API response validation — defensive against backend
 * legacy data that may not match current strict rules.
 *
 * @internal
 */
const fields = {
  email: z.email('Adresse email invalide'),
  password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères'),
  pseudoStrict: z
    .string()
    .min(3, 'Le pseudo doit faire au moins 3 caractères')
    .max(50, 'Le pseudo ne peut pas dépasser 50 caractères'),
  pseudoLoose: z.string().min(1),
  resetToken: z.string().min(1, 'Token manquant'),
  gdprConsent: z.boolean().refine((v) => v === true, {
    message: 'Vous devez accepter les conditions pour continuer',
  }),
} as const

/**
 * Public User shape, as returned by the API.
 *
 * @public
 */
export const userSchema = z.object({
  id: z.uuidv4(),
  email: fields.email,
  pseudo: fields.pseudoLoose,
  role: roleSchema,
  authProvider: authProviderSchema,
  settings: userSettingsSchema,
  gdprConsent: z.boolean(),
  gdprConsentDate: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type User = z.infer<typeof userSchema>

/**
 * Payload for `POST /auth/login`.
 *
 * @public
 */
export const loginPayloadSchema = z.object({
  email: fields.email,
  password: fields.password,
})

export type LoginPayload = z.infer<typeof loginPayloadSchema>

/**
 * Payload for `POST /auth/register`.
 *
 * @public
 */
export const registerPayloadSchema = z.object({
  email: fields.email,
  pseudo: fields.pseudoStrict,
  password: fields.password,
  gdprConsent: fields.gdprConsent,
})

export type RegisterPayload = z.infer<typeof registerPayloadSchema>

/**
 * Payload for `POST /auth/forgot-password`.
 *
 * @remarks
 * Backend always returns 204, regardless of whether the email exists, to
 * prevent enumeration attacks.
 *
 * @public
 */
export const forgotPasswordPayloadSchema = z.object({
  email: fields.email,
})

export type ForgotPasswordPayload = z.infer<typeof forgotPasswordPayloadSchema>

/**
 * Payload for `POST /auth/reset-password`.
 *
 * @remarks
 * The `token` comes from the reset email link (e.g. `?token=xxx` in URL).
 *
 * @public
 */
export const resetPasswordPayloadSchema = z.object({
  token: fields.resetToken,
  password: fields.password,
})

export type ResetPasswordPayload = z.infer<typeof resetPasswordPayloadSchema>
