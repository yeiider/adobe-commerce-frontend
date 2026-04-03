'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { SortFields } from '@/src/types/common.types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SortByProps {
  /** Available sort options from GraphQL */
  sortFields?: SortFields | null
  /** Additional class names */
  className?: string
}

// Default sort options if not provided by API
const DEFAULT_SORT_OPTIONS = [
  { label: 'Relevancia', value: 'relevance' },
  { label: 'Nombre: A - Z', value: 'name_ASC' },
  { label: 'Nombre: Z - A', value: 'name_DESC' },
  { label: 'Precio: Menor a Mayor', value: 'price_ASC' },
  { label: 'Precio: Mayor a Menor', value: 'price_DESC' },
  { label: 'Más Recientes', value: 'created_at_DESC' },
]

/**
 * SortBy - Product sorting dropdown
 * 
 * Allows users to sort products by different criteria.
 * Manages sort state via URL search params.
 * 
 * @example
 * <SortBy sortFields={products.sort_fields} />
 */
export function SortBy({ sortFields, className = '' }: SortByProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort') || 'relevance'

  // Build sort options from API or use defaults
  const sortOptions = sortFields?.options?.length
    ? sortFields.options.flatMap((opt) => [
        { label: `${opt.label}: Asc`, value: `${opt.value}_ASC` },
        { label: `${opt.label}: Desc`, value: `${opt.value}_DESC` },
      ])
    : DEFAULT_SORT_OPTIONS

  const handleSortChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      
      // Reset to page 1 when sort changes
      params.delete('page')
      
      if (value === 'relevance' || value === sortFields?.default) {
        params.delete('sort')
      } else {
        params.set('sort', value)
      }
      
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.push(newUrl, { scroll: false })
    },
    [pathname, router, searchParams, sortFields?.default]
  )

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor="sort-select" className="text-sm text-muted-foreground whitespace-nowrap">
        Ordenar por:
      </label>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger id="sort-select" className="w-[180px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevancia</SelectItem>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
