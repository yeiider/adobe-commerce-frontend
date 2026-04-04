/**
 * Storyblok URL Resolver
 *
 * Determines whether a given URL path should be served from Storyblok CMS
 * or handled by the Magento / Next.js routing layer.
 *
 * Decision tree:
 *  1. Is the path in the Magento reserved list? → Magento wins, skip Storyblok.
 *  2. Is there an explicit slug mapping for the path? → Use that Storyblok slug.
 *  3. Try the path (stripped of leading slash) as a Storyblok slug directly.
 *     If no story exists, Magento handles it.
 */

import { fetchStoryBySlug } from './client'
import type { StoryblokBlok, StoryblokStory } from '@/src/types/storyblok.types'

// ─── Magento reserved paths ────────────────────────────────────────────────────

/**
 * Paths that are always handled by Magento / Next.js and should NEVER be
 * forwarded to Storyblok, even if a matching story happens to exist.
 */
const MAGENTO_RESERVED: RegExp[] = [
  /^\/cart/,
  /^\/checkout/,
  /^\/customer/,
  /^\/catalogsearch/,
  /^\/api\//,
]

export function isMagentoPath(path: string): boolean {
  return MAGENTO_RESERVED.some((re) => re.test(path))
}

// ─── Explicit slug map ────────────────────────────────────────────────────────

/**
 * Static path → Storyblok slug map.
 *
 * Add entries here when the Storyblok slug differs from the URL path,
 * or when you want to pin a URL explicitly (e.g. "/" → "home").
 *
 * For all other paths the slug is derived from the URL automatically.
 */
const SLUG_MAP: Readonly<Record<string, string>> = {
  '/': 'home',
}

// ─── Public helpers ────────────────────────────────────────────────────────────

/**
 * Resolve a URL path to a candidate Storyblok slug.
 * Returns `null` when the path belongs to the Magento layer.
 */
export function resolveSlug(urlPath: string): string | null {
  if (isMagentoPath(urlPath)) return null

  if (SLUG_MAP[urlPath]) return SLUG_MAP[urlPath]

  // Strip leading slash; empty string means root → "home"
  const derived = urlPath.replace(/^\/+/, '') || 'home'
  return derived
}

/**
 * Try to load the Storyblok story for a given URL path.
 *
 * - Returns the story object when a match is found.
 * - Returns `null` when the path belongs to Magento or when no Storyblok
 *   story exists for it (404 from the API).
 *
 * The result of this function should be used to decide whether to render
 * `<StoryblokRenderer>` or fall through to the Magento route handler.
 */
export async function tryResolveStory(
  urlPath: string
): Promise<StoryblokStory<StoryblokBlok> | null> {
  const slug = resolveSlug(urlPath)
  if (!slug) return null

  try {
    const { story } = await fetchStoryBySlug(slug)
    return story
  } catch {
    // 404 or network error — let the Magento layer handle it
    return null
  }
}
