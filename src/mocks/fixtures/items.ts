import type { Item } from '@/schemas/item'

const demoUserId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

/**
 * Sample note item — minimal content, no thumbnail.
 *
 * @internal
 */
export const sampleNote: Item = {
  id: 'a1b2c3d4-1234-4abc-9def-0123456789ab',
  userId: demoUserId,
  contentType: 'note',
  title: 'TDD avec Vitest',
  slug: 'tdd-avec-vitest',
  content: 'Red, Green, Refactor — la boucle qui rend les tests utiles.',
  sourceAuthor: 'N.C',
  thumbnailUrl: null,
  metadata: {},
  createdAt: '2026-03-15T10:00:00.000Z',
  updatedAt: null,
}

/**
 * Sample book item — with thumbnail and rich metadata.
 *
 * @internal
 */
export const sampleBook: Item = {
  id: 'b2c3d4e5-1234-4abc-8def-0123456789cd',
  userId: demoUserId,
  contentType: 'livre',
  title: 'Atomic Habits',
  slug: 'atomic-habits',
  content: 'Petits changements, gains massifs sur la durée.',
  sourceAuthor: 'James Clear',
  thumbnailUrl:
    'https://img.leboncoin.fr/api/v1/lbcpb1/images/b2/66/d9/b266d9206689285ed357860c069fbd71df29366c.jpg?rule=ad-large',
  metadata: {
    isbn: '978-0735211292',
    pages: 320,
    language: 'en',
  },
  createdAt: '2026-02-01T09:30:00.000Z',
  updatedAt: '2026-02-10T14:20:00.000Z',
}

/**
 * Sample podcast item — with duration metadata.
 *
 * @internal
 */
export const samplePodcast: Item = {
  id: 'c3d4e5f6-1234-4abc-bdef-0123456789ef',
  userId: demoUserId,
  contentType: 'podcast',
  title: 'Lex Fridman #424 — Consciousness and LLMs',
  slug: 'lex-fridman-424-consciousness-and-llms',
  content: 'Discussion fascinante sur la conscience et les LLM.',
  sourceAuthor: 'Lex Fridman',
  thumbnailUrl: null,
  metadata: {
    duration: '3h12m',
    channel: 'Lex Fridman Podcast',
  },
  createdAt: '2026-01-20T15:00:00.000Z',
  updatedAt: null,
}

/**
 * All sample items, ready to seed the MSW in-memory store.
 *
 * @internal
 */
export const allSampleItems: Item[] = [sampleNote, sampleBook, samplePodcast]
