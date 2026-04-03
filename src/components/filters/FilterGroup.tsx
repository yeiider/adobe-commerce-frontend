'use client'

import { useState } from 'react'
import type { Aggregation } from '@/src/types/common.types'
import { FilterOption } from './FilterOption'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FilterGroupProps {
  /** The aggregation data */
  aggregation: Aggregation
  /** Function to check if a value is active */
  isActive: (attributeCode: string, value: string) => boolean
  /** Handler for toggling a filter */
  onToggle: (attributeCode: string, value: string) => void
  /** Max items to show before "Show more" */
  initialVisibleCount?: number
  /** Whether the group is initially expanded */
  defaultExpanded?: boolean
}

/**
 * FilterGroup - A collapsible group of filter options
 * 
 * Renders a single aggregation (e.g., "Color", "Size") with its options.
 * Supports collapsing/expanding and "Show more" functionality.
 * 
 * @example
 * <FilterGroup
 *   aggregation={colorAggregation}
 *   isActive={(code, val) => activeFilters.includes(val)}
 *   onToggle={(code, val) => toggleFilter(code, val)}
 * />
 */
export function FilterGroup({
  aggregation,
  isActive,
  onToggle,
  initialVisibleCount = 5,
  defaultExpanded = true,
}: FilterGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [showAll, setShowAll] = useState(false)

  const { attribute_code, label, options } = aggregation
  
  // Filter out options with 0 count
  const validOptions = options.filter((opt) => opt.count > 0)
  
  if (validOptions.length === 0) {
    return null
  }

  const visibleOptions = showAll 
    ? validOptions 
    : validOptions.slice(0, initialVisibleCount)
  
  const hasMoreOptions = validOptions.length > initialVisibleCount
  const hiddenCount = validOptions.length - initialVisibleCount

  // Check if this is a color/swatch type filter
  const isColorFilter = attribute_code === 'color'

  return (
    <div className="border-b border-border pb-4">
      {/* Group Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between py-2 text-left"
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-medium text-foreground">{label}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Options */}
      {isExpanded && (
        <div className="mt-2 space-y-1">
          {isColorFilter ? (
            // Color swatches layout
            <div className="flex flex-wrap gap-2">
              {visibleOptions.map((option) => (
                <FilterOption
                  key={option.value}
                  option={option}
                  attributeCode={attribute_code}
                  isActive={isActive(attribute_code, option.value)}
                  onToggle={onToggle}
                  variant="swatch"
                />
              ))}
            </div>
          ) : (
            // Default checkbox layout
            <div className="space-y-1">
              {visibleOptions.map((option) => (
                <FilterOption
                  key={option.value}
                  option={option}
                  attributeCode={attribute_code}
                  isActive={isActive(attribute_code, option.value)}
                  onToggle={onToggle}
                  variant="checkbox"
                />
              ))}
            </div>
          )}

          {/* Show More/Less Button */}
          {hasMoreOptions && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="mt-2 h-auto p-0 text-xs text-primary hover:text-primary/80"
            >
              {showAll 
                ? 'Ver menos' 
                : `Ver ${hiddenCount} más`
              }
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
