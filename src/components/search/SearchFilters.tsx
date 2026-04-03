import type { Aggregation } from '@/src/types/common.types'
import { FilterSidebar } from '@/src/components/filters'

interface SearchFiltersProps {
  aggregations: Aggregation[]
  className?: string
}

export function SearchFilters({ aggregations, className }: SearchFiltersProps) {
  return <FilterSidebar aggregations={aggregations} className={className} />
}
