import Link from 'next/link'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination'

interface CategoryPaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function CategoryPagination({ currentPage, totalPages, basePath }: CategoryPaginationProps) {
  // Generate the page URL
  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath
    }
    return `${basePath}?page=${page}`
  }

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 2 // Number of pages to show on each side of current
    const pages: (number | 'ellipsis')[] = []
    
    // Always show first page
    pages.push(1)
    
    // Calculate start and end of visible range
    const start = Math.max(2, currentPage - delta)
    const end = Math.min(totalPages - 1, currentPage + delta)
    
    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('ellipsis')
    }
    
    // Add visible page numbers
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('ellipsis')
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    
    return pages
  }

  const visiblePages = getVisiblePages()
  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          {hasPrevious ? (
            <Link href={getPageUrl(currentPage - 1)} passHref legacyBehavior>
              <PaginationPrevious />
            </Link>
          ) : (
            <PaginationPrevious className="pointer-events-none opacity-50" />
          )}
        </PaginationItem>

        {/* Page Numbers */}
        {visiblePages.map((page, index) => (
          <PaginationItem key={`page-${index}`}>
            {page === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <Link href={getPageUrl(page)} passHref legacyBehavior>
                <PaginationLink isActive={page === currentPage}>
                  {page}
                </PaginationLink>
              </Link>
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          {hasNext ? (
            <Link href={getPageUrl(currentPage + 1)} passHref legacyBehavior>
              <PaginationNext />
            </Link>
          ) : (
            <PaginationNext className="pointer-events-none opacity-50" />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
