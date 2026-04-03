'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchSuggestionItemProps {
  term: string
  onSelect: (term: string) => void
  className?: string
}

export function SearchSuggestionItem({ term, onSelect, className }: SearchSuggestionItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(term)}
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
        'hover:bg-accent hover:text-accent-foreground text-left',
        className
      )}
    >
      <Search className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
      <span className="truncate">{term}</span>
    </button>
  )
}
