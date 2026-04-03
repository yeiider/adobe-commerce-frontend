'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchInput } from './SearchInput'
import { SearchButton } from './SearchButton'

interface SearchBarProps {
  initialQuery?: string
  className?: string
}

export function SearchBar({ initialQuery = '', className }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState(initialQuery)
  const [isSearching, setIsSearching] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setIsSearching(true)
    router.push(`/catalogsearch/result?q=${encodeURIComponent(query.trim())}`)
    setIsSearching(false)
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
          className="flex-1"
        />
        <SearchButton
          isLoading={isSearching}
          disabled={!query.trim()}
        />
      </div>
    </form>
  )
}
