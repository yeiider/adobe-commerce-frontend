export function ProductSpecifications({ attributes }: { attributes: any[] }) {
  if (!attributes || attributes.length === 0) return null

  return (
    <div className="mb-12">
      <h3 className="mb-4 text-lg font-semibold">Especificaciones</h3>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="divide-y">
          {attributes.map((attr: any) => {
            const value = attr.value || (attr.selected_options ? attr.selected_options.map((o: any) => o.label).join(', ') : null)
            if (!value) return null
            return (
              <div key={attr.code} className="flex justify-between px-4 py-3 text-sm">
                <span className="font-medium text-muted-foreground">{attr.code.replace(/_/g, ' ').toUpperCase()}</span>
                <span className="font-semibold">{value}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
