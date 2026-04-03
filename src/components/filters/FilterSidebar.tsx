'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Aggregation, ActiveFilter } from '@/src/types/common.types'
import { FilterGroup } from './FilterGroup'
import { ActiveFilters } from './ActiveFilters'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface FilterSidebarProps {
  /** Available aggregations from GraphQL */
  aggregations: Aggregation[]
  /** Category ID to exclude from filters (already filtered by URL) */
  categoryId?: string
  /** Additional class names */
  className?: string
}

/**
 * FilterSidebar - Layered Navigation Component
 * 
 * Displays filter options based on product aggregations.
 * Manages filter state via URL search params for SEO and shareability.
 * 
 * @example
 * <FilterSidebar 
 *   aggregations={products.aggregations} 
 *   categoryId={category.uid}
 * />
 */
export function FilterSidebar({ 
  aggregations, 
  categoryId,
  className = '' 
}: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get current filter values from URL
  const getActiveFilters = useCallback((): ActiveFilter[] => {
    const active: ActiveFilter[] = []
    
    aggregations.forEach((agg) => {
      const values = searchParams.getAll(agg.attribute_code)
      values.forEach((value) => {
        const option = agg.options.find((opt) => opt.value === value)
        if (option) {
          active.push({
            attributeCode: agg.attribute_code,
            label: agg.label,
            value: value,
            valueLabel: option.label,
          })
        }
      })
    })
    
    return active
  }, [aggregations, searchParams])

  // Build new URL with updated filters
  const buildFilterUrl = useCallback(
    (attributeCode: string, value: string, action: 'add' | 'remove' | 'toggle') => {
      const params = new URLSearchParams(searchParams.toString())
      
      // Reset to page 1 when filters change
      params.delete('page')
      
      const currentValues = params.getAll(attributeCode)
      
      if (action === 'toggle') {
        if (currentValues.includes(value)) {
          // Remove the value
          params.delete(attributeCode)
          currentValues
            .filter((v) => v !== value)
            .forEach((v) => params.append(attributeCode, v))
        } else {
          // Add the value
          params.append(attributeCode, value)
        }
      } else if (action === 'add') {
        if (!currentValues.includes(value)) {
          params.append(attributeCode, value)
        }
      } else if (action === 'remove') {
        params.delete(attributeCode)
        currentValues
          .filter((v) => v !== value)
          .forEach((v) => params.append(attributeCode, v))
      }
      
      return `${pathname}?${params.toString()}`
    },
    [pathname, searchParams]
  )

  // Handle filter toggle
  const handleFilterToggle = useCallback(
    (attributeCode: string, value: string) => {
      const url = buildFilterUrl(attributeCode, value, 'toggle')
      router.push(url, { scroll: false })
    },
    [buildFilterUrl, router]
  )

  // Handle removing a single filter
  const handleRemoveFilter = useCallback(
    (attributeCode: string, value: string) => {
      const url = buildFilterUrl(attributeCode, value, 'remove')
      router.push(url, { scroll: false })
    },
    [buildFilterUrl, router]
  )

  // Clear all filters
  const handleClearAll = useCallback(() => {
    const params = new URLSearchParams()
    // Keep sort if present
    const sort = searchParams.get('sort')
    if (sort) params.set('sort', sort)
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newUrl, { scroll: false })
  }, [pathname, router, searchParams])

  // Check if a filter value is active
  const isFilterActive = useCallback(
    (attributeCode: string, value: string) => {
      return searchParams.getAll(attributeCode).includes(value)
    },
    [searchParams]
  )

  // Filter out category_id and category_uid from display (already filtered by URL)
  const displayAggregations = aggregations.filter(
    (agg) => !['category_id', 'category_uid'].includes(agg.attribute_code)
  )

  const activeFilters = getActiveFilters()
  const hasActiveFilters = activeFilters.length > 0

  if (displayAggregations.length === 0) {
    return null
  }

  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Filtros activos
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Limpiar todo
            </Button>
          </div>
          <ActiveFilters 
            filters={activeFilters} 
            onRemove={handleRemoveFilter} 
          />
        </div>
      )}

      {/* Filter Groups */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Filtrar por</h2>
        
        {displayAggregations.map((aggregation) => (
          <FilterGroup
            key={aggregation.attribute_code}
            aggregation={aggregation}
            isActive={isFilterActive}
            onToggle={handleFilterToggle}
          />
        ))}
      </div>
    </aside>
  )
}
