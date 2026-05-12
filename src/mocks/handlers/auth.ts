import { http, HttpResponse } from 'msw'
import type { User } from '@/schemas/user'
import { logger } from '@/utils/logger'
import { demoAdmin, demoCustomer } from '@/mocks/fixtures/users'

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1'

const SESSION_KEY = 'memoria_mock_user'

const credentials: Record<string, { password: string; user: User }> = {
  'demo@memoria.dev': { password: 'demo1234', user: demoCustomer },
  'admin@memoria.dev': { password: 'admin1234', user: demoAdmin },
}

function getCurrentMockUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function setCurrentMockUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  } catch {
    // ignore
  }
}

interface LoginBody {
  email?: string
  password?: string
}

interface RegisterBody {
  email?: string
  pseudo?: string
  password?: string
  gdprConsent?: boolean
}

interface ForgotPasswordBody {
  email?: string
}

interface ResetPasswordBody {
  token?: string
  password?: string
}

/**
 * MSW handlers for the `/auth/*` and `/users/me` endpoints.
 *
 * @remarks
 * Demo credentials:
 * - `demo@memoria.dev` / `demo1234` → customer
 * - `admin@memoria.dev` / `admin1234` → admin
 *
 * For password reset testing: after submitting the forgot-password form,
 * open the browser console — the "email link" is logged so you can copy
 * and navigate to it manually.
 *
 * @internal
 */
export const authHandlers = [
  http.post(`${baseUrl}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as LoginBody
    const entry = body.email ? credentials[body.email] : undefined

    if (!entry || entry.password !== body.password) {
      return HttpResponse.json({ message: 'Email ou mot de passe incorrect' }, { status: 401 })
    }

    setCurrentMockUser(entry.user)
    return HttpResponse.json(entry.user)
  }),

  http.post(`${baseUrl}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as RegisterBody

    if (body.email && credentials[body.email]) {
      return HttpResponse.json({ message: 'Un compte existe déjà avec cet email' }, { status: 409 })
    }

    const now = new Date().toISOString()
    const newUser: User = {
      id: crypto.randomUUID(),
      email: body.email ?? '',
      pseudo: body.pseudo ?? '',
      role: 'customer',
      authProvider: 'local',
      settings: {},
      gdprConsent: body.gdprConsent ?? false,
      gdprConsentDate: body.gdprConsent ? now : null,
      createdAt: now,
      updatedAt: now,
    }

    credentials[newUser.email] = {
      password: body.password ?? '',
      user: newUser,
    }
    setCurrentMockUser(newUser)
    return HttpResponse.json(newUser, { status: 201 })
  }),

  http.post(`${baseUrl}/auth/logout`, () => {
    setCurrentMockUser(null)
    return HttpResponse.json({ ok: true })
  }),

  http.get(`${baseUrl}/auth/me`, () => {
    const user = getCurrentMockUser()
    if (!user) {
      return HttpResponse.json({ message: 'Non authentifié' }, { status: 401 })
    }
    return HttpResponse.json(user)
  }),

  // ─── Reset password flow ───────────────────────────────────────────

  http.post(`${baseUrl}/auth/forgot-password`, async ({ request }) => {
    const body = (await request.json()) as ForgotPasswordBody

    // Real backend would send an email. Here we log the "link" so the dev
    // can copy/paste it to test the flow.
    const fakeToken = `mock-${crypto.randomUUID()}`
    const link = `${window.location.origin}/reset-password?token=${fakeToken}`
    logger.info(`[MSW] Reset link for ${body.email}:`, link)

    // Always 204 (anti-enumeration).
    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${baseUrl}/auth/reset-password`, async ({ request }) => {
    const body = (await request.json()) as ResetPasswordBody

    if (!body.token || !body.password) {
      return HttpResponse.json({ message: 'Token ou mot de passe manquant' }, { status: 400 })
    }

    if (!body.token.startsWith('mock-')) {
      return HttpResponse.json({ message: 'Token invalide ou expiré' }, { status: 400 })
    }

    return new HttpResponse(null, { status: 204 })
  }),

  // ─── Delete account ────────────────────────────────────────────────

  http.delete(`${baseUrl}/users/me`, () => {
    const user = getCurrentMockUser()
    if (!user) {
      return HttpResponse.json({ message: 'Non authentifié' }, { status: 401 })
    }

    delete credentials[user.email]
    setCurrentMockUser(null)
    return new HttpResponse(null, { status: 204 })
  }),
]
