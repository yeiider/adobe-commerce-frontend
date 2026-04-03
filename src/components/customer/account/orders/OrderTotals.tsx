'use client'

import { Receipt } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { usePriceFormatter } from '@/src/components/providers/StoreProvider'
import type { OrderTotal } from '@/src/types/customer.types'

interface OrderTotalsProps {
  total: OrderTotal
}

export function OrderTotals({ total }: OrderTotalsProps) {
  const formatPrice = usePriceFormatter()

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Receipt className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Resumen del pedido</h3>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">{formatPrice(total.subtotal.value)}</span>
        </div>

        {total.total_shipping.value > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Envío</span>
            <span className="text-foreground">{formatPrice(total.total_shipping.value)}</span>
          </div>
        )}

        {total.total_shipping.value === 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Envío</span>
            <span className="text-green-600 dark:text-green-400 font-medium">Gratis</span>
          </div>
        )}

        {total.total_tax.value > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Impuestos</span>
            <span className="text-foreground">{formatPrice(total.total_tax.value)}</span>
          </div>
        )}

        {total.discounts && total.discounts.length > 0 && total.discounts.map((discount, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-muted-foreground">{discount.label}</span>
            <span className="text-green-600 dark:text-green-400">
              -{formatPrice(discount.amount.value)}
            </span>
          </div>
        ))}

        <Separator />

        <div className="flex justify-between font-semibold text-base">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">{formatPrice(total.grand_total.value)}</span>
        </div>
      </div>
    </div>
  )
}
