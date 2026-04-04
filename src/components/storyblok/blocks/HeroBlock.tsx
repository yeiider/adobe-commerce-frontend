import Image from 'next/image'
import Link from 'next/link'
import type { HeroBlok } from '@/src/types/storyblok.types'
import { resolveHref } from '../utils'

interface HeroBlockProps {
  blok: HeroBlok
}

export function HeroBlock({ blok }: HeroBlockProps) {
  const {
    title,
    subtitle,
    background_image,
    cta_label,
    cta_link,
    overlay_opacity = 40,
    text_alignment = 'center',
  } = blok

  const alignClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[text_alignment]

  const href = resolveHref(cta_link)

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '480px' }}>
      {/* Background image */}
      {background_image?.filename ? (
        <Image
          src={background_image.filename}
          alt={background_image.alt || title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}

      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlay_opacity / 100 }}
        aria-hidden
      />

      {/* Content */}
      <div className={`relative flex min-h-[480px] flex-col justify-center px-6 py-16 md:px-16 ${alignClass}`}>
        <div className="mx-auto w-full max-w-3xl">
          {title && (
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-4 text-lg text-white/80 md:text-xl">{subtitle}</p>
          )}
          {cta_label && href && (
            <Link
              href={href}
              className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-gray-900 transition-colors hover:bg-white/90"
            >
              {cta_label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
