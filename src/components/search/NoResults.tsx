import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NoResultsProps {
  query: string
}

export function NoResults({ query }: NoResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>

      <h2 className="mb-2 text-2xl font-bold text-foreground">
        Sin resultados para &ldquo;{query}&rdquo;
      </h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        No encontramos productos que coincidan con tu búsqueda. Intenta con otras palabras
        o explora nuestras categorías.
      </p>

      <ul className="mb-8 space-y-2 text-sm text-muted-foreground text-left">
        <li className="flex items-start gap-2">
          <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
          Verifica que las palabras estén bien escritas
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
          Usa términos más generales
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
          Prueba con sinónimos o nombres alternativos
        </li>
      </ul>

      <Button asChild>
        <Link href="/">Ir al inicio</Link>
      </Button>
    </div>
  )
}
