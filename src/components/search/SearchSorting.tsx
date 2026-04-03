import type { SortFields } from '@/src/types/common.types'
import { SortBy } from '@/src/components/filters/SortBy'

interface SearchSortingProps {
  sortFields?: SortFields | null
}

export function SearchSorting({ sortFields }: SearchSortingProps) {
  return <SortBy sortFields={sortFields} />
}
