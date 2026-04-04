'use client'

/**
 * StoryblokBridge (Client Component)
 *
 * Loads the Storyblok JS Bridge in the browser to enable the Visual Editor
 * live-preview experience (click-to-edit, real-time content updates).
 *
 * This component should be rendered only when:
 *  - The app is in preview / draft mode, AND
 *  - The page is being edited inside the Storyblok Visual Editor iframe.
 *
 * It does NOT affect production rendering — the bridge script is never
 * downloaded unless explicitly mounted.
 *
 * Usage (in a server page that opts into preview):
 *   import { StoryblokBridge } from '@/src/components/storyblok/StoryblokBridge'
 *   ...
 *   {isDraft && <StoryblokBridge onUpdate={handleUpdate} />}
 */

import { useEffect } from 'react'
import type { StoryblokBlok, StoryblokStory } from '@/src/types/storyblok.types'

interface StoryblokBridgeProps {
  /** Called with the updated story whenever the editor saves / changes content */
  onUpdate: (story: StoryblokStory<StoryblokBlok>) => void
  /** Storyblok story ID to listen on */
  storyId?: number
}

declare global {
  interface Window {
    // Injected by the Storyblok bridge script
    StoryblokBridge?: new (options?: Record<string, unknown>) => {
      on: (events: string[], callback: (payload: { story: StoryblokStory<StoryblokBlok> }) => void) => void
    }
  }
}

export function StoryblokBridge({ onUpdate, storyId }: StoryblokBridgeProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//app.storyblok.com/f/storyblok-v2-latest.js'
    script.type = 'text/javascript'
    script.async = true

    script.onload = () => {
      if (!window.StoryblokBridge) return

      const bridge = new window.StoryblokBridge({
        resolveRelations: [],
        ...(storyId ? { customParent: window.location.origin } : {}),
      })

      bridge.on(['input', 'published', 'change'], ({ story }) => {
        onUpdate(story)
      })
    }

    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [onUpdate, storyId])

  // Renders nothing — effect-only component
  return null
}
