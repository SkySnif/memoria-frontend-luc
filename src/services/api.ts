import { z } from 'zod'
import { logger } from '@/utils/logger'

/**
 * Error thrown when an API call fails (non-2xx response, network error,
 * schema validation failure).
 *
 * @remarks
 * `status` is the HTTP status code (0 for network errors), `body` is the
 * parsed response body when available, useful for surfacing server-side
 * messages in the UI.
 *
 * @public
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Optional request configuration for the api service.
 *
 * @public
 */
export interface ApiRequestOptions {
  /** Additional headers, merged with the defaults. */
  headers?: Record<string, string>
  /** Optional AbortSignal for cancellation. */
  signal?: AbortSignal
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1'

/**
 * Builds the absolute URL for a given path.
 *
 * @internal
 */
function buildUrl(path: string): string {
  if (path.startsWith('http')) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${normalized}`
}

/**
 * Parses the response body as JSON when applicable, returns text otherwise.
 *
 * @internal
 */
async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch {
      return null
    }
  }
  const text = await response.text()
  return text || null
}

/**
 * Performs the raw HTTP request, throws ApiError on failure.
 *
 * @internal
 */
async function rawRequest(
  method: string,
  path: string,
  options: ApiRequestOptions & { body?: unknown } = {},
): Promise<unknown> {
  const { body, headers = {}, signal } = options

  const isJsonBody = body !== undefined && body !== null
  const requestInit: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    signal,
  }

  if (isJsonBody) {
    requestInit.body = JSON.stringify(body)
  }

  let response: Response
  try {
    response = await fetch(buildUrl(path), requestInit)
  } catch (e) {
    logger.error(`Network error on ${method} ${path}`, e)
    throw new ApiError('Erreur réseau', 0)
  }

  const data = await parseBody(response)

  if (!response.ok) {
    const message = (data as { message?: string } | null)?.message ?? response.statusText
    throw new ApiError(message, response.status, data)
  }

  return data
}

/**
 * HTTP client with Zod-validated responses.
 *
 * @remarks
 * All methods send credentials (cookies) and validate the response body
 * against the provided schema. Throws `ApiError` on non-2xx responses,
 * network errors, or schema mismatches.
 *
 * @public
 */
export const api = {
  /**
   * GET request with Zod-validated response.
   */
  async get<T>(path: string, schema: z.ZodType<T>, options?: ApiRequestOptions): Promise<T> {
    const data = await rawRequest('GET', path, options)
    return schema.parse(data)
  },

  /**
   * POST request with JSON body and Zod-validated response.
   *
   * @param body - request payload (will be JSON-serialized). Pass
   *   `undefined` for endpoints that don't take a body.
   */
  async post<T>(
    path: string,
    body: unknown,
    schema: z.ZodType<T>,
    options?: ApiRequestOptions,
  ): Promise<T> {
    const data = await rawRequest('POST', path, { ...options, body })
    return schema.parse(data)
  },

  /**
   * PATCH request with JSON body and Zod-validated response.
   *
   * @param body - partial update payload (will be JSON-serialized).
   */
  async patch<T>(
    path: string,
    body: unknown,
    schema: z.ZodType<T>,
    options?: ApiRequestOptions,
  ): Promise<T> {
    const data = await rawRequest('PATCH', path, { ...options, body })
    return schema.parse(data)
  },

  /**
   * DELETE request. Most delete endpoints return 204 No Content, so the
   * schema parameter is optional.
   */
  async delete(path: string, options?: ApiRequestOptions): Promise<void> {
    await rawRequest('DELETE', path, options)
  },
}
