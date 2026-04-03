'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { usePriceFormatter } from '@/src/components/providers/StoreProvider'
import { config } from '@/src/config/env'
import type { OrderItem } from '@/src/types/customer.types'

interface OrderItemsListProps {
  items: OrderItem[]
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  const formatPrice = usePriceFormatter()

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">
          Productos ({items.length})
        </h2>
      </div>

      <ul className="divide-y divide-border">
        {items.map((item) => {
          const imageUrl = item.product?.thumbnail?.url || config.images.placeholderUrl
          const imageAlt = item.product?.thumbnail?.label || item.product_name

          return (
            <li key={item.id} className="flex gap-4 px-5 py-4">
              {/* Thumbnail */}
              <Link href={`/${item.product_url_key}`} className="shrink-0">
                <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="object-cover object-center"
                    sizes="64px"
                  />
                </div>
              </Link>

              {/* Info + precio */}
              <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-center sm:gap-4">
                <div className="space-y-0.5 min-w-0">
                  <Link
                    href={`/${item.product_url_key}`}
                    className="text-sm font-medium text-foreground hover:underline line-clamp-2"
                  >
                    {item.product_name}
                  </Link>
                  <p className="text-xs text-muted-foreground">SKU: {item.product_sku}</p>
                  {item.discounts && item.discounts.length > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Descuento: {item.discounts.map((d) => d.label).join(', ')}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 sm:shrink-0 sm:text-right">
                  <span className="text-xs text-muted-foreground">
                    Cant. {item.quantity_ordered}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(item.product_sale_price.value * item.quantity_ordered)}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
