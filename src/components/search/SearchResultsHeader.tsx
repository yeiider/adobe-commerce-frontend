import { Search } from 'lucide-react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface SearchResultsHeaderProps {
  query: string
  totalCount: number
}

export function SearchResultsHeader({ query, totalCount }: SearchResultsHeaderProps) {
  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
          <li className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-1 transition-colors hover:text-foreground">
              <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">Inicio</span>
            </Link>
          </li>
          <li className="flex items-center flex-shrink-0">
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-0.5 sm:mx-1 text-muted-foreground/60" />
            <span className="font-medium text-foreground" aria-current="page">
              Resultados de búsqueda
            </span>
          </li>
        </ol>
      </nav>

      {/* Search info banner */}
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Search className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Resultados para</p>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              &ldquo;{query}&rdquo;
            </h1>
          </div>
        </div>

        {totalCount > 0 && (
          <p className="text-sm text-muted-foreground sm:text-right">
            <span className="font-semibold text-foreground">{totalCount}</span>{' '}
            {totalCount === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
        )}
      </div>
    </div>
  )
}
