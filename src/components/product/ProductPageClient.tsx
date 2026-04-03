'use client'

import { useState } from 'react'
import { ProductOptions } from './ProductOptions'
import { ProductGallery } from './ProductGallery'
import { ProductDescription } from './ProductDescription'
import { RelatedProductsCarousel } from './RelatedProductsCarousel'
import { formatPrice } from '@/src/utils/format'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart } from 'lucide-react'

interface ProductPageClientProps {
  product: any // Using 'any' for flexibility until strict typing matches the whole dynamic tree
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const {
    name,
    sku,
    stock_status,
    description,
    short_description,
    media_gallery,
    price_range,
    custom_attributesV2,
    configurable_options,
    variants,
    related_products,
  } = product

  const [currentVariant, setCurrentVariant] = useState<any | null>(null)

  // 1. Image Gallery Logic:
  // Use variant's specific image gallery if it exists, otherwise fallback to the base product's gallery.
  const variantMedia = currentVariant?.product?.media_gallery
  const activeGallery = variantMedia && variantMedia.length > 0 ? variantMedia : (media_gallery || [])

  // 2. Price Logic:
  const minimumPrice = price_range?.minimum_price
  const isOutOfStock = stock_status === 'OUT_OF_STOCK'
  
  // Use variant price if selected, otherwise fallback to base minimum price
  const displayPrice = currentVariant?.product?.price_range?.maximum_price?.final_price || minimumPrice?.final_price
  const displayRegularPrice = minimumPrice?.regular_price
  
  const discountPercent = minimumPrice?.discount?.percent_off ?? 0
  const hasDiscount = discountPercent > 0 && !currentVariant

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:h-fit">
          {/* Key forces the gallery to re-mount/re-evaluate when activeGallery changes significantly or variant changes */}
          <ProductGallery 
            key={currentVariant ? currentVariant.product.sku : 'base'} 
            mediaGallery={activeGallery} 
            name={name} 
          />
        </div>

        {/* Right Column: Product Details */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>SKU: {currentVariant ? currentVariant.product.sku : sku}</span>
              <Separator orientation="vertical" className="h-4" />
              {isOutOfStock ? (
                <span className="font-medium text-destructive">Agotado</span>
              ) : (
                <span className="font-medium text-emerald-600">Disponible</span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="mb-8 flex items-end gap-3 rounded-lg bg-muted/50 p-6">
            <span className="text-4xl font-bold tracking-tight text-foreground">
              {displayPrice ? formatPrice({ value: displayPrice.value, currency: displayPrice.currency || minimumPrice?.final_price.currency }) : ''}
            </span>
            {hasDiscount && (
              <>
                <span className="mb-1 text-lg text-muted-foreground line-through">
                  {formatPrice(displayRegularPrice)}
                </span>
                <span className="mb-1 rounded-md bg-destructive/10 px-2 py-1 text-sm font-semibold text-destructive">
                  -{Math.round(discountPercent)}%
                </span>
              </>
            )}
          </div>

          {/* Short Description */}
          <div className="mb-8">
            <ProductDescription shortDescription={short_description?.html} />
          </div>

          <Separator className="mb-8" />

          {/* Configurable Options */}
          {configurable_options && configurable_options.length > 0 && (
            <div className="mb-8">
              <ProductOptions 
                options={configurable_options} 
                variants={variants}
                onVariantChange={setCurrentVariant}
              />
            </div>
          )}

          {/* Add to Cart Actions */}
          <div className="mb-12 flex flex-col gap-4 sm:flex-row">
            <Button 
              size="lg" 
              className="flex-1 gap-2 text-lg font-semibold uppercase tracking-wider"
              disabled={isOutOfStock || (configurable_options?.length > 0 && !currentVariant)}
            >
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? 'Agotado' : 'Añadir al Carrito'}
            </Button>
          </div>

        </div>
      </div>

      {/* Full Description at the bottom */}
      {description?.html && (
        <div className="mt-16">
          <Separator className="mb-8" />
          <h3 className="mb-6 text-2xl font-semibold tracking-tight">Detalles del Producto</h3>
          <div 
            className="prose prose-base max-w-none text-muted-foreground lg:prose-lg"
            dangerouslySetInnerHTML={{ __html: description.html }}
          />
        </div>
      )}

      {/* Cross-sells / Related Products Carousel */}
      <RelatedProductsCarousel products={related_products} />
    </div>
  )
}
