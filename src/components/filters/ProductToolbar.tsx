'use client'

import { useState } from 'react'
import type { SortFields } from '@/src/types/common.types'
import { SortBy } from './SortBy'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, Grid, List } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface ProductToolbarProps {
  /** Total number of products */
  totalCount: number
  /** Sort fields from API */
  sortFields?: SortFields | null
  /** Filter sidebar content for mobile sheet */
  filterContent?: React.ReactNode
  /** View mode */
  viewMode?: 'grid' | 'list'
  /** Handler for view mode change */
  onViewModeChange?: (mode: 'grid' | 'list') => void
  /** Additional class names */
  className?: string
}

/**
 * ProductToolbar - Controls bar above product grid
 * 
 * Displays product count, sorting options, and filter toggle for mobile.
 * 
 * @example
 * <ProductToolbar
 *   totalCount={124}
 *   sortFields={products.sort_fields}
 *   filterContent={<FilterSidebar aggregations={aggregations} />}
 * />
 */
export function ProductToolbar({
  totalCount,
  sortFields,
  filterContent,
  viewMode = 'grid',
  onViewModeChange,
  className = '',
}: ProductToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      {/* Left side: Product count & mobile filter toggle */}
      <div className="flex items-center gap-4">
        {/* Mobile Filter Button */}
        {filterContent && (
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="lg:hidden"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filtrar productos</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                {filterContent}
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Product Count */}
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{totalCount}</span>
          {' '}{totalCount === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      {/* Right side: Sort & View Mode */}
      <div className="flex items-center gap-4">
        {/* View Mode Toggle */}
        {onViewModeChange && (
          <div className="hidden items-center gap-1 sm:flex">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => onViewModeChange('grid')}
              aria-label="Vista de cuadrícula"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => onViewModeChange('list')}
              aria-label="Vista de lista"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Sort Dropdown */}
        <SortBy sortFields={sortFields} />
      </div>
    </div>
  )
}
