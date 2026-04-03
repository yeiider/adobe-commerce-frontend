import Link from 'next/link'
import Image from 'next/image'
import type { Product, ConfigurableProduct, ConfigurableOption } from '@/src/types/product.types'
import { formatPrice } from '@/src/utils/format'
import { ConfigurableOptions } from '@/src/components/product/ConfigurableOptions'

interface CategoryProductListProps {
  products: Product[]
}

// Type guard to check if product is configurable
function isConfigurableProduct(product: Product): product is ConfigurableProduct {
  return product.__typename === 'ConfigurableProduct' && 'configurable_options' in product
}

export function CategoryProductList({ products }: CategoryProductListProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.uid || product.sku} product={product} />
      ))}
    </div>
  )
}

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const { name, url_key, url_suffix, thumbnail, price_range, stock_status } = product
  const productUrl = `/${url_key}${url_suffix || ''}`
  
  const price = price_range?.minimum_price
  // Only show discount badge if percent_off is greater than 0
  const discountPercent = price?.discount?.percent_off ?? 0
  const hasDiscount = discountPercent > 0
  const isOutOfStock = stock_status === 'OUT_OF_STOCK'
  
  // Get configurable options if product is configurable
  const configurableOptions = isConfigurableProduct(product) 
    ? product.configurable_options 
    : null

  return (
    <article className="group relative flex flex-col">
      <Link href={productUrl} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {thumbnail?.url ? (
            <Image
              src={thumbnail.url}
              alt={thumbnail.label || name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-sm text-muted-foreground">Sin imagen</span>
            </div>
          )}

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute left-2 top-2 rounded bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
              Agotado
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && !isOutOfStock && (
            <div className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              -{Math.round(price.discount!.percent_off)}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-3 flex flex-col gap-1">
          <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
            {name}
          </h3>

          {/* Price */}
          {price && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {formatPrice(price.final_price)}
              </span>
              
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(price.regular_price)}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Configurable Options (outside of Link to be interactive) */}
      {configurableOptions && configurableOptions.length > 0 && (
        <div className="mt-2">
          <ConfigurableOptions 
            options={configurableOptions} 
            compact={true}
            maxVisible={5}
          />
        </div>
      )}
    </article>
  )
}
