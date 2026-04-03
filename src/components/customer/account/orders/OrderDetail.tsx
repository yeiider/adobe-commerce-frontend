'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, PackageX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCustomerOrder } from '@/src/services/customer.service'
import { OrderDetailHeader } from './OrderDetailHeader'
import { OrderItemsList } from './OrderItemsList'
import { OrderAddressCard } from './OrderAddressCard'
import { OrderShippingPayment } from './OrderShippingPayment'
import { OrderTotals } from './OrderTotals'
import type { CustomerOrder } from '@/src/types/customer.types'

interface OrderDetailProps {
  orderNumber: string
}

export function OrderDetail({ orderNumber }: OrderDetailProps) {
  const [order, setOrder] = useState<CustomerOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCustomerOrder(orderNumber).then((res) => {
      setOrder(res)
      setIsLoading(false)
    })
  }, [orderNumber])

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <PackageX className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <p className="font-medium text-foreground">Pedido no encontrado</p>
        <p className="mt-1 text-sm text-muted-foreground">
          No pudimos encontrar el pedido #{orderNumber}.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/customer/account/orders">Ver mis pedidos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <OrderDetailHeader order={order} />

      <OrderItemsList items={order.items} />

      <OrderShippingPayment
        shippingMethod={order.shipping_method}
        paymentMethods={order.payment_methods}
      />

      {(order.shipping_address || order.billing_address) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {order.shipping_address && (
            <OrderAddressCard title="Dirección de envío" address={order.shipping_address} />
          )}
          {order.billing_address && (
            <OrderAddressCard title="Dirección de facturación" address={order.billing_address} />
          )}
        </div>
      )}

      <OrderTotals total={order.total} />
    </div>
  )
}
