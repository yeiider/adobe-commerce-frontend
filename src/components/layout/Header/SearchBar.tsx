'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import useSWR from 'swr'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getSearchSuggestions } from '@/src/services/search.service'
import { useDebouncedValue } from '@/src/hooks/use-debounced-value'
import { SearchSuggestions } from '@/src/components/search/SearchSuggestions'

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

const MIN_CHARS = 3
const DEBOUNCE_MS = 350

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [query, setQuery] = React.useState('')
  const [isSearching, setIsSearching] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS)
  const shouldFetch = debouncedQuery.length >= MIN_CHARS

  const { data: suggestionsData, isLoading: suggestionsLoading } = useSWR(
    shouldFetch ? ['search-suggestions', debouncedQuery] : null,
    () => getSearchSuggestions(debouncedQuery),
    { revalidateOnFocus: false }
  )

  // Show dropdown when we have a query long enough
  React.useEffect(() => {
    setShowSuggestions(query.length >= MIN_CHARS)
  }, [query])

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    if (!isOpen) {
      setQuery('')
      setShowSuggestions(false)
    }
  }, [isOpen])

  // Close on Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (showSuggestions) {
          setShowSuggestions(false)
        } else {
          onClose()
        }
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, showSuggestions])

  // Close suggestions on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setIsSearching(true)
    setShowSuggestions(false)
    router.push(`/catalogsearch/result?q=${encodeURIComponent(query.trim())}`)
    setIsSearching(false)
    onClose()
  }

  const handleSelectTerm = (term: string) => {
    setShowSuggestions(false)
    router.push(`/catalogsearch/result?q=${encodeURIComponent(term)}`)
    onClose()
  }

  return (
    <div
      className={cn(
        'overflow-visible transition-all duration-300',
        isOpen ? 'max-h-20 border-t border-border py-4' : 'max-h-0 overflow-hidden'
      )}
    >
      <div ref={containerRef} className="relative">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="search"
                placeholder="Buscar productos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= MIN_CHARS && setShowSuggestions(true)}
                className="h-12 pl-10 pr-24"
                aria-label="Buscar productos"
                role="combobox"
                aria-expanded={showSuggestions}
                aria-autocomplete="list"
                aria-controls="search-suggestions"
              />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setQuery('')
                    setShowSuggestions(false)
                    inputRef.current?.focus()
                  }}
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button type="submit" size="sm" disabled={isSearching || !query.trim()}>
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Buscar'
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Live suggestions dropdown */}
        {showSuggestions && (
          <div id="search-suggestions">
            <SearchSuggestions
              query={debouncedQuery || query}
              suggestions={suggestionsData?.suggestions ?? []}
              products={suggestionsData?.products ?? []}
              isLoading={suggestionsLoading}
              onSelectTerm={handleSelectTerm}
              onClose={() => {
                setShowSuggestions(false)
                onClose()
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
