'use client'

import * as React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
  inputRef?: React.RefObject<HTMLInputElement>
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Buscar productos...',
  autoFocus,
  className,
  inputRef,
}: SearchInputProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        className="h-12 pl-10 pr-10"
        aria-label={placeholder}
      />
      {value && onClear && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 h-8 w-8"
          onClick={onClear}
          aria-label="Limpiar búsqueda"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
