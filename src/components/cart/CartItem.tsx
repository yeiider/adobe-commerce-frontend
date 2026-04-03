'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CartItem as CartItemType } from '@/src/types/cart.types'
import { config } from '@/src/config/env'
import { usePriceFormatter } from '@/src/components/providers/StoreProvider'
import { CartItemQuantity } from './CartItemQuantity'
import { cn } from '@/lib/utils'

interface CartItemProps {
  item: CartItemType
  isReadOnly?: boolean
  className?: string
}

export function CartItem({ item, isReadOnly = false, className }: CartItemProps) {
  const formatPrice = usePriceFormatter()

  const imageUrl = item.product.thumbnail?.url || config.images.placeholderUrl
  
  // Format configurations and bundle options if any exists
  const hasOptions = (item.configurable_options && item.configurable_options.length > 0) || 
                     (item.bundle_options && item.bundle_options.length > 0)

  return (
    <div className={cn("flex gap-4 py-4", className)}>
      {/* Product Image */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
        <Image
          src={imageUrl}
          alt={item.product.name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium leading-tight">
              <Link
                href={`/p/${item.product.url_key}`}
                className="hover:underline line-clamp-2"
              >
                {item.product.name}
              </Link>
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">SKU: {item.product.sku}</p>

            {hasOptions && (
              <div className="mt-1 flex flex-col gap-0.5">
                {item.configurable_options?.map((option) => (
                  <p key={option.id} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{option.option_label}:</span>{' '}
                    {option.value_label}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold sm:text-base">
              {formatPrice(item.prices.row_total.value)}
            </p>
            {item.prices.discounts && item.prices.discounts.length > 0 && (
              <p className="text-xs text-destructive line-through">
                {formatPrice(item.prices.row_total_including_tax.value)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between sm:mt-0">
          <CartItemQuantity
            cartItemUid={item.uid}
            quantity={item.quantity}
            isReadOnly={isReadOnly}
          />
        </div>
      </div>
    </div>
  )
}
