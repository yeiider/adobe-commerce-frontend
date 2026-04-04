/**
 * Storyblok Service
 *
 * High-level data-access layer for Storyblok CMS content.
 * All functions are safe to call from React Server Components and return
 * `null` instead of throwing so callers can fall back gracefully.
 *
 * Usage:
 *   import { getHomePage, getStoryBySlug } from '@/src/services/storyblok.service'
 */

import {
  fetchStoryBySlug,
  fetchStoryById,
  fetchStories,
  type FetchStoriesOptions,
} from '@/src/lib/storyblok/client'
import type {
  StoryblokBlok,
  StoryblokFetchOptions,
  StoryblokStory,
  PageBlok,
} from '@/src/types/storyblok.types'

// Re-export so callers can use FetchStoriesOptions without knowing the module path
export type { FetchStoriesOptions }

// ─── Page-level helpers ───────────────────────────────────────────────────────

/**
 * Fetch the site home page story (slug: "home").
 * Returns `null` when Storyblok is not configured or the story doesn't exist.
 */
export async function getHomePage(
  opts: StoryblokFetchOptions = {}
): Promise<StoryblokStory<PageBlok> | null> {
  try {
    const { story } = await fetchStoryBySlug<PageBlok>('home', opts)
    return story
  } catch {
    return null
  }
}

// ─── Generic story helpers ────────────────────────────────────────────────────

/**
 * Fetch a single story by its full slug.
 *
 * @param slug  Storyblok full_slug, e.g. "about", "pages/faq"
 */
export async function getStoryBySlug<T extends StoryblokBlok = StoryblokBlok>(
  slug: string,
  opts: StoryblokFetchOptions = {}
): Promise<StoryblokStory<T> | null> {
  try {
    const { story } = await fetchStoryBySlug<T>(slug, opts)
    return story
  } catch {
    return null
  }
}

/**
 * Fetch a single story by its numeric or UUID identifier.
 * Useful when a block stores a story reference by ID.
 *
 * @param id  Numeric story ID or UUID string
 */
export async function getStoryById<T extends StoryblokBlok = StoryblokBlok>(
  id: number | string,
  opts: StoryblokFetchOptions = {}
): Promise<StoryblokStory<T> | null> {
  try {
    const { story } = await fetchStoryById<T>(id, opts)
    return story
  } catch {
    return null
  }
}

// ─── Collection helpers ───────────────────────────────────────────────────────

/**
 * Fetch all stories whose full_slug starts with `prefix`.
 * Useful for blog posts, promotions, landing pages, etc.
 *
 * @param prefix  e.g. "promotions/" or "blog/"
 */
export async function getStoriesByPrefix<T extends StoryblokBlok = StoryblokBlok>(
  prefix: string,
  opts: Omit<FetchStoriesOptions, 'starts_with'> = {}
): Promise<StoryblokStory<T>[]> {
  try {
    const { stories } = await fetchStories<T>({ starts_with: prefix, ...opts })
    return stories
  } catch {
    return []
  }
}
