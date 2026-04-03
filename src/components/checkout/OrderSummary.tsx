'use client'

import Image from 'next/image'
import type { Cart } from '@/src/types/cart.types'
import { CouponForm } from '@/src/components/cart/CouponForm'

interface Props {
  cart: Cart | null
}

export function OrderSummary({ cart }: Props) {
  if (!cart) {
    return (
      <div className="rounded-md border p-6 bg-card shadow-sm opacity-50">
        <h3 className="text-lg font-medium mb-4">Resumen del Pedido</h3>
        <p className="text-sm text-muted-foreground">Cargando detalles...</p>
      </div>
    )
  }

  const { items, prices, shipping_addresses } = cart

  // Check if there is shipping applied in prices
  const selectedShipping = shipping_addresses?.[0]?.selected_shipping_method

  const formatPrice = (value: number, currency: string) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency || 'COP',
    }).format(value)

  return (
    <div className="rounded-md border p-6 bg-card shadow-sm sticky top-24">
      <h3 className="text-lg font-medium mb-4">Resumen del Pedido</h3>
      
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.uid} className="flex gap-4">
            <div className="relative h-16 w-16 bg-muted rounded-md overflow-hidden shrink-0">
              {item.product.thumbnail?.url ? (
                <Image
                  src={item.product.thumbnail.url}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex w-full h-full items-center justify-center text-muted-foreground text-xs">
                  Sin imagen
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-sm font-medium line-clamp-2">{item.product.name}</span>
              <span className="text-xs text-muted-foreground">Cant: {item.quantity}</span>
              <span className="text-sm font-medium mt-1">
                {formatPrice(item.prices.row_total.value, item.prices.row_total.currency)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <CouponForm />

      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(prices.subtotal_excluding_tax.value, prices.subtotal_excluding_tax.currency)}</span>
        </div>

        {selectedShipping && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Envío ({selectedShipping.carrier_title})</span>
            <span>{formatPrice(selectedShipping.amount.value, selectedShipping.amount.currency)}</span>
          </div>
        )}

        {prices.applied_taxes?.map((tax, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{tax.label || 'Impuestos'}</span>
            <span>{formatPrice(tax.amount.value, tax.amount.currency)}</span>
          </div>
        ))}

        {prices.discounts?.map((discount, i) => (
          <div key={i} className="flex justify-between text-sm text-green-600">
            <span>Descuento ({discount.label})</span>
            <span>-{formatPrice(discount.amount.value, discount.amount.currency)}</span>
          </div>
        ))}

        <div className="border-t pt-3 flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>{formatPrice(prices.grand_total.value, prices.grand_total.currency)}</span>
        </div>
      </div>
    </div>
  )
}
