'use client'

import { Truck, CreditCard } from 'lucide-react'
import type { CustomerOrder } from '@/src/types/customer.types'

interface OrderShippingPaymentProps {
  shippingMethod?: string
  paymentMethods: CustomerOrder['payment_methods']
}

export function OrderShippingPayment({ shippingMethod, paymentMethods }: OrderShippingPaymentProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Shipping method */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Método de envío</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {shippingMethod ?? 'No especificado'}
        </p>
      </div>

      {/* Payment methods */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Método de pago</h3>
        </div>
        <ul className="space-y-1">
          {paymentMethods.map((method, i) => (
            <li key={i} className="text-sm text-muted-foreground">
              {method.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
