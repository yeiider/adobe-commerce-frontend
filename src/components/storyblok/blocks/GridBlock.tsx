import type { StoryblokBlok } from '@/src/types/storyblok.types'
import { StoryblokRenderer } from '../StoryblokRenderer'
import { HeroBannerBlock, type HeroBannerBlok } from './HeroBannerBlock'

interface GridBlokRuntime extends StoryblokBlok {
  component: 'grid'
  /** Storyblok usa "columns" como nombre del campo de bloques anidados */
  columns?: StoryblokBlok[]
  column_count?: number
  gap?: 'sm' | 'md' | 'lg'
}

interface GridBlockProps {
  blok: GridBlokRuntime
}

const gapClass: Record<string, string> = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-8',
}

function colClass(count: number): string {
  if (count === 3) return 'grid-cols-1 sm:grid-cols-3'
  if (count >= 4) return 'grid-cols-2 lg:grid-cols-4'
  return 'grid-cols-1 sm:grid-cols-2'
}

function isHeroBanner(blok: StoryblokBlok): blok is HeroBannerBlok {
  return blok.component === 'hero_banner'
}

export function GridBlock({ blok }: GridBlockProps) {
  const { columns = [], column_count, gap = 'md' } = blok
  const count = column_count ?? columns.length ?? 2

  if (!columns.length) return null

  return (
    <section className="container mx-auto px-4 py-4">
      <div className={`grid ${colClass(count)} ${gapClass[gap] ?? gapClass.md}`}>
        {columns.map((item) => (
          <div key={item._uid} className="overflow-hidden rounded-lg">
            {isHeroBanner(item) ? (
              <HeroBannerBlock blok={item} variant="card" />
            ) : (
              <StoryblokRenderer blocks={[item]} />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
