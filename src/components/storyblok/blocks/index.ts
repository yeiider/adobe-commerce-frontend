/**
 * Block Component Registry
 *
 * Maps Storyblok component names to their React implementations.
 * Add a new entry here whenever you create a new block type in Storyblok.
 *
 * Naming convention: Storyblok component name (snake_case) → React component (PascalCase)
 */

import type { ComponentType } from 'react'
import type { StoryblokBlok } from '@/src/types/storyblok.types'

import { HeroBlock } from './HeroBlock'
import { BannerBlock } from './BannerBlock'
import { FeaturedCategoriesBlock } from './FeaturedCategoriesBlock'
import { NewsletterBlock } from './NewsletterBlock'
import { RichTextBlock } from './RichTextBlock'
import { GridBlock } from './GridBlock'
import { TeaserBlock } from './TeaserBlock'
import { HeroBannerBlock } from './HeroBannerBlock'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BlockComponent = ComponentType<{ blok: any }>

export const BLOCK_REGISTRY: Record<string, BlockComponent> = {
  // ── Layout & containers ──────────────────────────────────────────────────────
  grid: GridBlock,

  // ── Marketing sections ───────────────────────────────────────────────────────
  hero: HeroBlock,
  hero_banner: HeroBannerBlock,
  banner: BannerBlock,
  newsletter: NewsletterBlock,

  // ── Commerce blocks ──────────────────────────────────────────────────────────
  featured_categories: FeaturedCategoriesBlock,

  // ── Content blocks ───────────────────────────────────────────────────────────
  rich_text: RichTextBlock,
  teaser: TeaserBlock,
}

/**
 * Look up a block component by its Storyblok component name.
 * Returns `null` when the component is not registered.
 */
export function resolveBlock(componentName: string): BlockComponent | null {
  return BLOCK_REGISTRY[componentName] ?? null
}

// Named re-exports for direct imports
export {
  HeroBlock,
  HeroBannerBlock,
  BannerBlock,
  FeaturedCategoriesBlock,
  NewsletterBlock,
  RichTextBlock,
  GridBlock,
  TeaserBlock,
}
