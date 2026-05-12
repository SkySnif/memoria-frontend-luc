import type { User } from '@/schemas/user'

/**
 * Demo customer user used by the MSW mock auth handlers.
 *
 * @remarks
 * UUID is a valid v4 (Zod 4's `.uuid()` is v4-strict by default).
 *
 * @internal
 */
export const demoCustomer: User = {
  id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  email: 'demo@memoria.dev',
  pseudo: 'DemoUser',
  role: 'customer',
  authProvider: 'local',
  settings: {},
  gdprConsent: true,
  gdprConsentDate: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

/**
 * Demo admin user used by the MSW mock auth handlers.
 *
 * @remarks
 * UUID is a valid v4.
 *
 * @internal
 */
export const demoAdmin: User = {
  id: 'c9b6c5e8-2d4f-4f7e-9c1a-3e8f1b9d8c2e',
  email: 'admin@memoria.dev',
  pseudo: 'AdminUser',
  role: 'admin',
  authProvider: 'local',
  settings: {},
  gdprConsent: true,
  gdprConsentDate: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}
