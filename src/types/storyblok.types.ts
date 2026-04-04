/**
 * Storyblok CMS Type Definitions
 *
 * Types are organized by layer:
 *  1. Primitive field types (Asset, Link, RichText)
 *  2. Block (component) types — one interface per Storyblok component
 *  3. Story & API response types
 */

// ─── Primitive field types ────────────────────────────────────────────────────

export interface StoryblokAsset {
  id: number
  alt: string
  name: string
  focus: string
  title: string
  filename: string
  copyright: string
  fieldtype: 'asset'
}

export interface StoryblokLink {
  id: string
  url: string
  linktype: 'url' | 'story' | 'email' | 'asset'
  fieldtype: 'multilink'
  cached_url: string
  story?: { full_slug: string }
}

export interface StoryblokRichTextNode {
  type: string
  content?: StoryblokRichTextNode[]
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
  attrs?: Record<string, unknown>
  text?: string
}

// ─── Base blok ───────────────────────────────────────────────────────────────

export interface StoryblokBlok {
  _uid: string
  component: string
  [key: string]: unknown
}

// ─── Block (component) interfaces ─────────────────────────────────────────────

/** Full-width hero section with background image and CTA */
export interface HeroBlok extends StoryblokBlok {
  component: 'hero'
  title: string
  subtitle: string
  background_image: StoryblokAsset
  cta_label: string
  cta_link: StoryblokLink
  /** 0–100 percentage for dark overlay on background image */
  overlay_opacity: number
  text_alignment: 'left' | 'center' | 'right'
}

/** Promotional banner with image and optional CTA */
export interface BannerBlok extends StoryblokBlok {
  component: 'banner'
  image: StoryblokAsset
  title: string
  description: string
  cta_label: string
  cta_link: StoryblokLink
  layout: 'full' | 'contained'
}

/** Grid of featured category cards driven by Magento category IDs */
export interface FeaturedCategoriesBlok extends StoryblokBlok {
  component: 'featured_categories'
  title: string
  /** Comma-separated Magento category IDs, e.g. "3,5,8" */
  category_ids: string
  columns: 2 | 3 | 4
}

/** Newsletter subscription strip */
export interface NewsletterBlok extends StoryblokBlok {
  component: 'newsletter'
  title: string
  description: string
  button_label: string
  input_placeholder: string
}

/** Rich-text content block */
export interface RichTextBlok extends StoryblokBlok {
  component: 'rich_text'
  content: StoryblokRichTextNode
}

/**
 * Generic two-column grid container.
 * items[] holds any other blok, rendered recursively.
 */
export interface GridBlok extends StoryblokBlok {
  component: 'grid'
  columns: 2 | 3 | 4
  gap: 'sm' | 'md' | 'lg'
  items: StoryblokBlok[]
}

/** Root page blok — body[] holds all section bloks */
export interface PageBlok extends StoryblokBlok {
  component: 'page'
  /** SEO title override */
  seo_title?: string
  /** SEO description override */
  seo_description?: string
  body: StoryblokBlok[]
}

export type AnyBlok =
  | HeroBlok
  | BannerBlok
  | FeaturedCategoriesBlok
  | NewsletterBlok
  | RichTextBlok
  | GridBlok
  | PageBlok
  | StoryblokBlok

// ─── Story & API response types ───────────────────────────────────────────────

export interface StoryblokStory<T extends StoryblokBlok = StoryblokBlok> {
  id: number
  uuid: string
  name: string
  slug: string
  full_slug: string
  created_at: string
  published_at: string | null
  first_published_at: string | null
  content: T
  is_startpage: boolean
  parent_id: number | null
  tag_list: string[]
  meta_data: Record<string, string> | null
  alternates: Array<{ id: number; name: string; slug: string; published: boolean; full_slug: string; is_folder: boolean; parent_id: number }>
}

export interface StoryblokStoryResponse<T extends StoryblokBlok = StoryblokBlok> {
  story: StoryblokStory<T>
  cv: number
  rels: StoryblokStory[]
  links: StoryblokStory[]
}

export interface StoryblokStoriesResponse<T extends StoryblokBlok = StoryblokBlok> {
  stories: StoryblokStory<T>[]
  cv: number
  rels: StoryblokStory[]
  links: StoryblokStory[]
  total: number
  per_page: number
  page: number
}

// ─── Fetch option types ────────────────────────────────────────────────────────

export type StoryblokVersion = 'published' | 'draft'

export interface StoryblokFetchOptions {
  /** Content version: "draft" for preview, "published" for live */
  version?: StoryblokVersion
  /** How to resolve link fields: "url" returns absolute URLs */
  resolve_links?: 'url' | 'story' | '0' | '1'
  /** Comma-separated relation fields to resolve */
  resolve_relations?: string
  /** Language code for translated content */
  language?: string
  /** Next.js ISR revalidation time in seconds */
  revalidate?: number
}
