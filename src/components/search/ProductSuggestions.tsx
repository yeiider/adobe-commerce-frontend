'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/src/types/product.types'

interface ProductSuggestionsProps {
  products: Pick<Product, 'uid' | 'name' | 'url_key' | 'thumbnail'>[]
  onSelect?: () => void
}

export function ProductSuggestions({ products, onSelect }: ProductSuggestionsProps) {
  if (!products.length) return null

  return (
    <div>
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Productos
      </p>
      <div className="space-y-0.5">
        {products.map((product) => (
          <Link
            key={product.uid}
            href={`/${product.url_key}`}
            onClick={onSelect}
            className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted">
              {product.thumbnail?.url ? (
                <Image
                  src={product.thumbnail.url}
                  alt={product.thumbnail.label || product.name}
                  fill
                  sizes="40px"
                  className="object-contain p-0.5"
                />
              ) : (
                <div className="h-full w-full bg-muted" />
              )}
            </div>
            <span className="line-clamp-2 text-sm text-foreground">{product.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
