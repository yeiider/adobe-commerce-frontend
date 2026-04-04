'use client'

import { useState } from 'react'
import type { NewsletterBlok } from '@/src/types/storyblok.types'

interface NewsletterBlockProps {
  blok: NewsletterBlok
}

export function NewsletterBlock({ blok }: NewsletterBlockProps) {
  const {
    title = 'Suscríbete a nuestro Newsletter',
    description = 'Recibe las últimas novedades y ofertas exclusivas',
    button_label = 'Suscribirse',
    input_placeholder = 'Tu correo electrónico',
  } = blok

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    // TODO: wire up to your email service / Magento newsletter subscription
    await new Promise((res) => setTimeout(res, 800))
    setStatus('success')
    setEmail('')
  }

  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {description && <p className="mt-2 text-primary-foreground/80">{description}</p>}

        {status === 'success' ? (
          <p className="mt-8 font-medium">¡Gracias por suscribirte!</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={input_placeholder}
              className="flex-1 rounded-lg border-0 bg-primary-foreground/10 px-4 py-2.5 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-lg bg-primary-foreground px-6 py-2.5 font-medium text-primary transition-colors hover:bg-primary-foreground/90 disabled:opacity-60"
            >
              {status === 'loading' ? '...' : button_label}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
