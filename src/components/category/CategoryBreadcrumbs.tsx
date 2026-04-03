'use client'

import { ChevronRight, Home } from 'lucide-react'
import type { Category } from '@/src/types/category.types'
import { LoadingLink } from '@/src/components/common/LoadingLink'

interface CategoryBreadcrumbsProps {
  category: Category
}

export function CategoryBreadcrumbs({ category }: CategoryBreadcrumbsProps) {
  const breadcrumbs = category.breadcrumbs || []

  return (
    <nav aria-label="Breadcrumb" className="mb-4 md:mb-6">
      <ol className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground overflow-x-auto scrollbar-hide pb-1">
        {/* Home */}
        <li className="flex items-center flex-shrink-0">
          <LoadingLink
            href="/"
            loadingMessage="Cargando inicio..."
            className="flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="sr-only">Inicio</span>
          </LoadingLink>
        </li>

        {/* Parent Categories */}
        {breadcrumbs.map((crumb) => (
          <li key={crumb.category_id} className="flex items-center flex-shrink-0">
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-0.5 sm:mx-1 text-muted-foreground/60" />
            <LoadingLink
              href={crumb.category_url_path ? `/${crumb.category_url_path}` : '#'}
              loadingMessage={`Cargando ${crumb.category_name}...`}
              className="transition-colors hover:text-foreground whitespace-nowrap"
            >
              {crumb.category_name}
            </LoadingLink>
          </li>
        ))}

        {/* Current Category */}
        <li className="flex items-center flex-shrink-0">
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-0.5 sm:mx-1 text-muted-foreground/60" />
          <span className="font-medium text-foreground whitespace-nowrap" aria-current="page">
            {category.name}
          </span>
        </li>
      </ol>
    </nav>
  )
}
