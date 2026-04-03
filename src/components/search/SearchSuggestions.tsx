'use client'

import { Loader2 } from 'lucide-react'
import { SearchSuggestionItem } from './SearchSuggestionItem'
import { ProductSuggestions } from './ProductSuggestions'
import type { SearchSuggestion, Product } from '@/src/types/product.types'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface SearchSuggestionsProps {
  query: string
  suggestions: SearchSuggestion[]
  products: Pick<Product, 'uid' | 'name' | 'url_key' | 'thumbnail'>[]
  isLoading: boolean
  onSelectTerm: (term: string) => void
  onClose: () => void
}

export function SearchSuggestions({
  query,
  suggestions,
  products,
  isLoading,
  onSelectTerm,
  onClose,
}: SearchSuggestionsProps) {
  const hasContent = suggestions.length > 0 || products.length > 0

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border bg-background shadow-lg">
      {isLoading && !hasContent ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : hasContent ? (
        <div className="max-h-[70vh] overflow-y-auto p-2">
          {/* Search suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-3">
              <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sugerencias
              </p>
              <div className="space-y-0.5">
                {suggestions.map((s) => (
                  <SearchSuggestionItem
                    key={s.search}
                    term={s.search}
                    onSelect={onSelectTerm}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Divider between sections */}
          {suggestions.length > 0 && products.length > 0 && (
            <div className="my-2 border-t border-border" />
          )}

          {/* Product suggestions */}
          {products.length > 0 && (
            <ProductSuggestions products={products} onSelect={onClose} />
          )}

          {/* View all results link */}
          <div className="mt-2 border-t border-border pt-2">
            <Link
              href={`/catalogsearch/result?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
            >
              <span>Ver todos los resultados para &ldquo;{query}&rdquo;</span>
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            No se encontraron sugerencias para &ldquo;{query}&rdquo;
          </p>
          <Link
            href={`/catalogsearch/result?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Buscar de todas formas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  )
}
