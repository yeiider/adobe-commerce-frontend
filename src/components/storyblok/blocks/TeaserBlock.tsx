import type { StoryblokBlok } from '@/src/types/storyblok.types'

interface TeaserBlok extends StoryblokBlok {
  component: 'teaser'
  headline: string
}

interface TeaserBlockProps {
  blok: TeaserBlok
}

export function TeaserBlock({ blok }: TeaserBlockProps) {
  if (!blok.headline) return null

  return (
    <section className="container mx-auto px-4 py-10 text-center">
      <h2 className="text-3xl font-bold text-foreground">{blok.headline}</h2>
    </section>
  )
}
