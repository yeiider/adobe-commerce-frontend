import Image from 'next/image'
import Link from 'next/link'
import type { StoryblokBlok, StoryblokLink } from '@/src/types/storyblok.types'
import { resolveHref } from '../utils'

export interface HeroBannerBlok extends StoryblokBlok {
  component: 'hero_banner'
  title: string
  imagen: string
  link: StoryblokLink
  description?: string
}

interface HeroBannerBlockProps {
  blok: HeroBannerBlok
  /** Cuando se renderiza dentro de un grid, la altura es relativa al contenedor */
  variant?: 'default' | 'card'
}

/** Normaliza URLs protocol-relative //... → https://... */
function normalizeImageUrl(url: string): string {
  if (!url) return ''
  return url.startsWith('//') ? `https:${url}` : url
}

export function HeroBannerBlock({ blok, variant = 'default' }: HeroBannerBlockProps) {
  const { title, imagen, link, description } = blok
  const imageUrl = normalizeImageUrl(imagen)
  const href = resolveHref(link)

  const isCard = variant === 'card'

  return (
    <div
      className={`relative w-full overflow-hidden ${isCard ? 'min-h-[200px]' : 'aspect-[1280/460] min-h-[300px]'}`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority={!isCard}
          className="object-cover object-center"
          sizes={isCard ? '(max-width: 768px) 100vw, 50vw' : '100vw'}
        />
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}

      {/* Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
        {title && (
          <p
            className={`font-bold leading-tight text-white ${
              isCard ? 'text-lg md:text-xl' : 'text-3xl md:text-5xl'
            }`}
          >
            {title}
          </p>
        )}
        {description && (
          <p className="mt-1 text-sm text-white/80 md:text-base">{description}</p>
        )}
        {href && href !== '#' && (
          <Link
            href={href}
            className="mt-3 inline-block w-fit rounded bg-white px-5 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-white/90"
          >
            Shop Now
          </Link>
        )}
      </div>
    </div>
  )
}
