/**
 * Storyblok Content Delivery API client
 *
 * Uses the native fetch API with Next.js ISR caching instead of the
 * @storyblok/react SDK so all fetches happen in React Server Components
 * without any "use client" boundary requirements.
 *
 * Docs: https://www.storyblok.com/docs/api/content-delivery/v2
 */

import { config } from '@/src/config/env'
import type {
  StoryblokBlok,
  StoryblokFetchOptions,
  StoryblokStoryResponse,
  StoryblokStoriesResponse,
  StoryblokVersion,
} from '@/src/types/storyblok.types'

const CDN_BASE = 'https://api.storyblok.com/v2/cdn'

// ─── Internal helpers ─────────────────────────────────────────────────────────

function getToken(): string {
  const token = config.storyblok.accessToken
  if (!token) {
    throw new Error(
      '[Storyblok] Missing access token. Set STORYBLOK_ACCESS_TOKEN in .env.local'
    )
  }
  return token
}

function getDefaultVersion(): StoryblokVersion {
  return config.storyblok.version
}

interface FetchParams extends StoryblokFetchOptions {
  /** Extra query-string params (e.g. starts_with, per_page) */
  extraParams?: Record<string, string>
}

async function cdnFetch<T>(endpoint: string, opts: FetchParams = {}): Promise<T> {
  const {
    version = getDefaultVersion(),
    resolve_links,
    resolve_relations,
    language,
    revalidate = config.storyblok.defaultRevalidate,
    extraParams = {},
  } = opts

  const qs = new URLSearchParams({ token: getToken(), version, ...extraParams })

  if (resolve_links) qs.set('resolve_links', resolve_links)
  if (resolve_relations) qs.set('resolve_relations', resolve_relations)
  if (language) qs.set('language', language)

  const url = `${CDN_BASE}${endpoint}?${qs.toString()}`

  // Draft mode → no-store (Visual Editor y dev siempre necesitan datos frescos)
  // Published mode → ISR con revalidate + cache tags
  const fetchInit: RequestInit =
    version === 'draft'
      ? { cache: 'no-store' }
      : { next: { revalidate, tags: ['storyblok'] } }

  const res = await fetch(url, fetchInit)

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`[Storyblok] ${res.status} ${res.statusText} — ${body}`)
  }

  return res.json() as Promise<T>
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch a single story by its full slug (e.g. "home", "about", "pages/faq").
 * Leading slashes are stripped automatically.
 */
export async function fetchStoryBySlug<T extends StoryblokBlok = StoryblokBlok>(
  slug: string,
  opts: StoryblokFetchOptions = {}
): Promise<StoryblokStoryResponse<T>> {
  const clean = slug.replace(/^\/+/, '')
  return cdnFetch<StoryblokStoryResponse<T>>(`/stories/${clean}`, opts)
}

/**
 * Fetch a single story by its numeric or UUID identifier.
 */
export async function fetchStoryById<T extends StoryblokBlok = StoryblokBlok>(
  id: number | string,
  opts: StoryblokFetchOptions = {}
): Promise<StoryblokStoryResponse<T>> {
  return cdnFetch<StoryblokStoryResponse<T>>(`/stories/${id}`, opts)
}

export interface FetchStoriesOptions extends StoryblokFetchOptions {
  /** Filter stories whose full_slug starts with this prefix */
  starts_with?: string
  per_page?: number
  page?: number
  sort_by?: string
  /** e.g. { "component": { "in": "hero" } } */
  filter_query?: Record<string, Record<string, string>>
}

/**
 * Fetch a paginated list of stories.
 */
export async function fetchStories<T extends StoryblokBlok = StoryblokBlok>(
  opts: FetchStoriesOptions = {}
): Promise<StoryblokStoriesResponse<T>> {
  const {
    starts_with,
    per_page = 25,
    page = 1,
    sort_by,
    filter_query,
    ...fetchOpts
  } = opts

  const extraParams: Record<string, string> = {
    per_page: String(per_page),
    page: String(page),
  }

  if (starts_with) extraParams['starts_with'] = starts_with
  if (sort_by) extraParams['sort_by'] = sort_by
  if (filter_query) {
    extraParams['filter_query'] = JSON.stringify(filter_query)
  }

  return cdnFetch<StoryblokStoriesResponse<T>>('/stories', {
    ...fetchOpts,
    extraParams,
  })
}
