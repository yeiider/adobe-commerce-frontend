import Image from 'next/image'
import Link from 'next/link'
import type { BannerBlok } from '@/src/types/storyblok.types'
import { resolveHref } from '../utils'

interface BannerBlockProps {
  blok: BannerBlok
}

export function BannerBlock({ blok }: BannerBlockProps) {
  const { image, title, description, cta_label, cta_link, layout = 'contained' } = blok

  const href = resolveHref(cta_link)

  const inner = (
    <div className="relative flex min-h-[320px] w-full overflow-hidden rounded-xl">
      {image?.filename ? (
        <Image
          src={image.filename}
          alt={image.alt || title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

      <div className="relative flex flex-col justify-end p-8 text-white">
        {title && <h2 className="text-3xl font-bold leading-snug">{title}</h2>}
        {description && (
          <p className="mt-2 max-w-lg text-base text-white/80">{description}</p>
        )}
        {cta_label && href && (
          <Link
            href={href}
            className="mt-6 inline-block w-fit rounded-lg bg-white px-6 py-2.5 font-semibold text-gray-900 transition-colors hover:bg-white/90"
          >
            {cta_label}
          </Link>
        )}
      </div>
    </div>
  )

  return layout === 'full' ? (
    <section className="w-full">{inner}</section>
  ) : (
    <section className="container mx-auto px-4 py-6">{inner}</section>
  )
}
