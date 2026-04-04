import type { StoryblokLink } from '@/src/types/storyblok.types'

/**
 * Resolve a Storyblok multilink field to a usable href string.
 * Returns "#" when the link is empty or undefined.
 */
export function resolveHref(link?: StoryblokLink): string {
  if (!link) return '#'

  switch (link.linktype) {
    case 'story':
      return link.story?.full_slug
        ? `/${link.story.full_slug.replace(/^\//, '')}`
        : link.cached_url
          ? `/${link.cached_url.replace(/^\//, '')}`
          : '#'

    case 'url':
      return link.url || link.cached_url || '#'

    case 'email':
      return link.url ? `mailto:${link.url}` : '#'

    case 'asset':
      return link.url || '#'

    default:
      return link.cached_url || '#'
  }
}

/**
 * Build the Storyblok image service URL with optional width/height transforms.
 * Storyblok image service docs: https://www.storyblok.com/docs/image-service
 */
export function storyblokImageUrl(
  filename: string,
  options: { width?: number; height?: number; quality?: number; format?: 'webp' | 'jpeg' | 'png' } = {}
): string {
  if (!filename) return ''

  const { width, height, quality = 80, format = 'webp' } = options

  const filters: string[] = [`format(${format})`, `quality(${quality})`]
  const resize = width || height ? `${width ?? 0}x${height ?? 0}` : '0x0'

  return `${filename}/m/${resize}/filters:${filters.join(':')}`
}
