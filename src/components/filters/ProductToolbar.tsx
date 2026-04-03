'use client'

import { useState } from 'react'
import type { SortFields } from '@/src/types/common.types'
import { SortBy } from './SortBy'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, Grid, List, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
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
    <div className={`flex flex-wrap items-center justify-between gap-3 ${className}`}>
      {/* Left side: Product count & mobile filter toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile Filter Button */}
        {filterContent && (
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="lg:hidden gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden xs:inline">Filtros</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="flex w-full flex-col p-0 sm:max-w-[350px]"
            >
              <SheetHeader className="flex-row items-center justify-between border-b border-border px-4 py-3">
                <SheetTitle className="text-base font-semibold">
                  Filtrar productos
                </SheetTitle>
              </SheetHeader>
              
              {/* Scrollable filter content */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {filterContent}
              </div>
              
              {/* Fixed footer with action buttons */}
              <div className="border-t border-border bg-background p-4">
                <div className="flex gap-3">
                  <SheetClose asChild>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                    >
                      Cerrar
                    </Button>
                  </SheetClose>
                  <Button 
                    className="flex-1"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Ver {totalCount} {totalCount === 1 ? 'producto' : 'productos'}
                  </Button>
                </div>
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
      <div className="flex items-center gap-2 sm:gap-4">
        {/* View Mode Toggle */}
        {onViewModeChange && (
          <div className="hidden items-center gap-1 sm:flex">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => onViewModeChange('grid')}
              aria-label="Vista de cuadricula"
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
