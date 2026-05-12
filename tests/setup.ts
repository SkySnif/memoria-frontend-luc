// Global test setup — runs before each test file.
// Add global mocks, custom matchers, or test utilities here.

import { afterEach, beforeAll, vi } from 'vitest'

beforeAll(() => {
  // Provide a default API base URL so service code constructs valid URLs in tests.
  vi.stubEnv('VITE_API_BASE_URL', 'http://test.local/api')
})

afterEach(() => {
  // Reset any global state between tests if needed.
})
