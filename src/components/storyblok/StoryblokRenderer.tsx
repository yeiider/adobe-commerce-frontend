/**
 * StoryblokRenderer
 *
 * Server Component that iterates over a Storyblok body array and renders
 * each blok using the registered block component.
 *
 * Unknown block types are silently skipped in production and shown as
 * a warning panel in development to aid debugging.
 */

import type { StoryblokBlok } from '@/src/types/storyblok.types'
import { resolveBlock } from './blocks'

interface StoryblokRendererProps {
  blocks: StoryblokBlok[]
}

export function StoryblokRenderer({ blocks }: StoryblokRendererProps) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((blok) => {
        const Block = resolveBlock(blok.component)

        if (!Block) {
          if (process.env.NODE_ENV === 'development') {
            return (
              <div
                key={blok._uid}
                className="mx-4 my-2 rounded border border-dashed border-red-400 bg-red-50 p-4 font-mono text-xs text-red-700"
              >
                <strong>[Storyblok]</strong> Unregistered block:{' '}
                <code className="font-bold">{blok.component}</code>
                <br />
                Add it to{' '}
                <code>src/components/storyblok/blocks/index.ts</code>
              </div>
            )
          }
          return null
        }

        return <Block key={blok._uid} blok={blok} />
      })}
    </>
  )
}
