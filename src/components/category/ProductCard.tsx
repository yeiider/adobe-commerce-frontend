'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Product, ConfigurableProduct } from '@/src/types/product.types'
import { formatPrice } from '@/src/utils/format'
import { ProductOptions } from '@/src/components/product/ProductOptions'
import { LoadingLink } from '@/src/components/common/LoadingLink'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCartQueue } from '@/src/components/providers/CartQueueProvider'
import { toast } from 'sonner'
import Link from 'next/link'

interface ProductCardProps {
  product: any
  priority?: boolean
}

// Type guard to check if product is configurable
function isConfigurableProduct(product: Product | any): product is ConfigurableProduct {
  return product.__typename === 'ConfigurableProduct' && 'configurable_options' in product
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { name, url_key, url_suffix, thumbnail, price_range, stock_status } = product
  const productUrl = `/${url_key}${url_suffix || ''}`
  
  const [currentVariant, setCurrentVariant] = useState<any | null>(null)
  
  const { addToCartQueue, isAdding } = useCartQueue()

  const isOutOfStock = stock_status === 'OUT_OF_STOCK'
  const isConfigurable = isConfigurableProduct(product)
  
  // Price Logic
  const minimumPrice = price_range?.minimum_price
  const displayPrice = currentVariant?.product?.price_range?.maximum_price?.final_price || minimumPrice?.final_price
  const discountPercent = minimumPrice?.discount?.percent_off ?? 0
  const hasDiscount = discountPercent > 0 && !currentVariant

  // Image Logic
  const displayThumbnail = currentVariant?.product?.thumbnail?.url || thumbnail?.url
  
  // Get configurable options if product is configurable
  const configurableOptions = isConfigurableProduct(product) ? product.configurable_options : null
  const variants = isConfigurableProduct(product) ? product.variants : []

  return (
    <article className="group relative flex flex-col h-full">
      <LoadingLink href={productUrl} loadingMessage={`Cargando ${name}...`} className="block flex-1">
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-background border">
          {displayThumbnail ? (
            <Image
              src={displayThumbnail}
              alt={thumbnail?.label || name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-contain object-bottom transition-transform duration-300 group-hover:scale-105 p-2"
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-sm text-muted-foreground">Sin imagen</span>
            </div>
          )}

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute left-2 top-2 rounded bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground z-10">
              Agotado
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && !isOutOfStock && (
            <div className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground z-10">
              -{Math.round(minimumPrice!.discount!.percent_off)}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-3 flex flex-col gap-1">
          <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
            {name}
          </h3>

          {/* Price */}
          {displayPrice && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {formatPrice({ value: displayPrice.value, currency: displayPrice.currency || minimumPrice?.final_price.currency })}
              </span>
              
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(minimumPrice!.regular_price)}
                </span>
              )}
            </div>
          )}
        </div>
      </LoadingLink>

      {/* Configurable Options (outside of Link to be interactive) */}
      {configurableOptions && configurableOptions.length > 0 && (
        <div className="mt-4 text-xs">
          <ProductOptions 
            options={configurableOptions} 
            variants={variants}
            onVariantChange={setCurrentVariant}
            compact={true}
          />
        </div>
      )}

      {/* Acciones */}
      <div className="mt-4 flex gap-2">
        {product.__typename !== 'SimpleProduct' ? (
          <Button asChild variant="default" className="w-full h-9">
            <Link href={productUrl}>
              {product.__typename === 'ConfigurableProduct' ? 'Ver Opciones' : 'Ver Detalles'}
            </Link>
          </Button>
        ) : (
          <Button 
            className="w-full h-9" 
            variant="default"
            disabled={isOutOfStock || isAdding}
            onClick={(e) => {
              e.preventDefault()
              if (!product.sku) return
              addToCartQueue([{ sku: product.sku, quantity: 1 }])
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isOutOfStock ? "Agotado" : "Añadir al Carrito"}
          </Button>
        )}
      </div>
    </article>
  )
}
