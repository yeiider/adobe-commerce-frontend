import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import type { FilterState } from '@/src/types/common.types'

interface SearchPaginationProps {
  query: string
  currentPage: number
  totalPages: number
  filterState?: FilterState
  sortParam?: string
}

export function SearchPagination({
  query,
  currentPage,
  totalPages,
  filterState,
  sortParam,
}: SearchPaginationProps) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams({ q: query })

    if (sortParam) params.set('sort', sortParam)

    if (filterState) {
      Object.entries(filterState).forEach(([key, values]) => {
        if (Array.isArray(values)) {
          values.forEach((v) => params.append(key, v))
        } else if (values) {
          params.set(key, values)
        }
      })
    }

    if (page > 1) params.set('page', page.toString())

    return `/catalogsearch/result?${params.toString()}`
  }

  const getVisiblePages = () => {
    const delta = 2
    const pages: (number | 'ellipsis')[] = []

    pages.push(1)

    const start = Math.max(2, currentPage - delta)
    const end = Math.min(totalPages - 1, currentPage + delta)

    if (start > 2) pages.push('ellipsis')

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages - 1) pages.push('ellipsis')

    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  const visiblePages = getVisiblePages()
  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {hasPrevious ? (
            <PaginationPrevious href={buildUrl(currentPage - 1)} />
          ) : (
            <PaginationPrevious href="#" className="pointer-events-none opacity-50" aria-disabled="true" />
          )}
        </PaginationItem>

        {visiblePages.map((page, index) => (
          <PaginationItem key={`page-${index}`}>
            {page === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink href={buildUrl(page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          {hasNext ? (
            <PaginationNext href={buildUrl(currentPage + 1)} />
          ) : (
            <PaginationNext href="#" className="pointer-events-none opacity-50" aria-disabled="true" />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
