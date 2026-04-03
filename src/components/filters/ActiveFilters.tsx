'use client'

import type { ActiveFilter } from '@/src/types/common.types'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ActiveFiltersProps {
  /** List of currently active filters */
  filters: ActiveFilter[]
  /** Handler for removing a filter */
  onRemove: (attributeCode: string, value: string) => void
  /** Additional class names */
  className?: string
}

/**
 * ActiveFilters - Display currently active filters as removable badges
 * 
 * Shows a list of active filter values that can be individually removed.
 * 
 * @example
 * <ActiveFilters
 *   filters={[
 *     { attributeCode: 'color', label: 'Color', value: '49', valueLabel: 'Red' },
 *     { attributeCode: 'size', label: 'Size', value: '175', valueLabel: 'M' },
 *   ]}
 *   onRemove={(code, val) => removeFilter(code, val)}
 * />
 */
export function ActiveFilters({ 
  filters, 
  onRemove,
  className = ''
}: ActiveFiltersProps) {
  if (filters.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {filters.map((filter) => (
        <Badge
          key={`${filter.attributeCode}-${filter.value}`}
          variant="secondary"
          className="flex items-center gap-1 pl-2 pr-1"
        >
          <span className="text-xs">
            <span className="text-muted-foreground">{filter.label}:</span>{' '}
            <span className="font-medium">{filter.valueLabel}</span>
          </span>
          <button
            type="button"
            onClick={() => onRemove(filter.attributeCode, filter.value)}
            className="ml-1 rounded-full p-0.5 hover:bg-muted"
            aria-label={`Remover filtro ${filter.label}: ${filter.valueLabel}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}
