import Link from 'next/link'
import Image from 'next/image'
import type { FeaturedCategoriesBlok } from '@/src/types/storyblok.types'
import { getCategoryById } from '@/src/services/category.service'

interface FeaturedCategoriesBlockProps {
  blok: FeaturedCategoriesBlok
}

const colClass: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
}

export async function FeaturedCategoriesBlock({ blok }: FeaturedCategoriesBlockProps) {
  const { title, category_ids, columns = 4 } = blok

  // Parse comma-separated IDs and fetch each category from Magento
  const ids = category_ids
    ? category_ids.split(',').map((id) => id.trim()).filter(Boolean)
    : []

  const categories = (
    await Promise.allSettled(ids.map((id) => getCategoryById(Number(id))))
  )
    .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getCategoryById>>> =>
      r.status === 'fulfilled' && r.value !== null
    )
    .map((r) => r.value)

  return (
    <section className="container mx-auto px-4 py-10">
      {title && (
        <h2 className="mb-6 text-2xl font-semibold text-foreground">{title}</h2>
      )}

      {categories.length > 0 ? (
        <div className={`grid gap-4 ${colClass[columns] ?? colClass[4]}`}>
          {categories.map((cat) => (
            <Link
              key={cat?.id}
              href={`/${cat?.url_path ?? ''}`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
            >
              {cat?.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name ?? ''}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-muted" />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <span className="text-base font-semibold text-white">{cat?.name}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Skeleton placeholders when category IDs are not configured yet
        <div className={`grid gap-4 ${colClass[columns] ?? colClass[4]}`}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}
    </section>
  )
}
