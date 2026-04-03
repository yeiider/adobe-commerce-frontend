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
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {/* Home */}
        <li className="flex items-center">
          <LoadingLink
            href="/"
            loadingMessage="Cargando inicio..."
            className="flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Inicio</span>
          </LoadingLink>
        </li>

        {/* Parent Categories */}
        {breadcrumbs.map((crumb) => (
          <li key={crumb.category_id} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />
            <LoadingLink
              href={crumb.category_url_path ? `/${crumb.category_url_path}` : '#'}
              loadingMessage={`Cargando ${crumb.category_name}...`}
              className="transition-colors hover:text-foreground"
            >
              {crumb.category_name}
            </LoadingLink>
          </li>
        ))}

        {/* Current Category */}
        <li className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />
          <span className="font-medium text-foreground" aria-current="page">
            {category.name}
          </span>
        </li>
      </ol>
    </nav>
  )
}
