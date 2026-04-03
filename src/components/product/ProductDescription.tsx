export function ProductDescription({ shortDescription, description }: { shortDescription?: string, description?: string }) {
  if (!shortDescription && !description) return null

  return (
    <div className="flex flex-col gap-6">
      {shortDescription && (
        <div 
          className="prose prose-sm text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: shortDescription }}
        />
      )}

      {description && (
        <div className="mt-4">
          <h3 className="mb-4 text-lg font-semibold">Detalles del Producto</h3>
          <div 
            className="prose prose-sm max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      )}
    </div>
  )
}
