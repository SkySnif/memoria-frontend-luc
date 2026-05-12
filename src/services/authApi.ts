import { z } from 'zod'
import { api } from './api'
import {
  userSchema,
  type ForgotPasswordPayload,
  type LoginPayload,
  type RegisterPayload,
  type ResetPasswordPayload,
  type User,
} from '@/schemas/user'

/**
 * Authentication API.
 *
 * @remarks
 * All methods send/receive session cookies (`credentials: 'include'`)
 * via the underlying `api` service. Validates responses with Zod.
 *
 * @public
 */
export const authApi = {
  /**
   * `POST /auth/login` — authenticate with email + password.
   *
   * @public
   */
  async login(payload: LoginPayload): Promise<User> {
    return api.post('/auth/login', payload, userSchema)
  },

  /**
   * `POST /auth/register` — create a new local account.
   *
   * @public
   */
  async register(payload: RegisterPayload): Promise<User> {
    return api.post('/auth/register', payload, userSchema)
  },

  /**
   * `POST /auth/logout` — destroy the current session.
   *
   * @public
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout', undefined, z.unknown())
  },

  /**
   * `GET /auth/me` — fetch the currently authenticated user.
   *
   * @public
   */
  async me(): Promise<User> {
    return api.get('/auth/me', userSchema)
  },

  /**
   * `POST /auth/forgot-password` — request a password reset email.
   *
   * @remarks
   * Backend always returns 204 to prevent email enumeration.
   *
   * @public
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await api.post('/auth/forgot-password', payload, z.unknown())
  },

  /**
   * `POST /auth/reset-password` — set a new password using a reset token.
   *
   * @throws {ApiError} 400 if the token is invalid or expired.
   *
   * @public
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await api.post('/auth/reset-password', payload, z.unknown())
  },

  /**
   * `DELETE /users/me` — permanently delete the current user's account.
   *
   * @remarks
   * Backend invalidates the session cookie server-side. The frontend
   * should clear its local stores and redirect to `/login` after success.
   *
   * @public
   */
  async deleteAccount(): Promise<void> {
    await api.delete('/users/me')
  },
}
