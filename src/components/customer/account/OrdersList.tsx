'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ChevronRight, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getCustomerOrders } from '@/src/services/customer.service'
import { usePriceFormatter } from '@/src/components/providers/StoreProvider'
import type { CustomerOrder } from '@/src/types/customer.types'

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  processing: { label: 'En proceso', variant: 'default' },
  complete: { label: 'Completado', variant: 'outline' },
  canceled: { label: 'Cancelado', variant: 'destructive' },
  closed: { label: 'Cerrado', variant: 'secondary' },
  holded: { label: 'En espera', variant: 'secondary' },
}

export function OrdersList() {
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const formatPrice = usePriceFormatter()

  useEffect(() => {
    getCustomerOrders().then((res) => {
      setOrders(res?.items || [])
      setIsLoading(false)
    })
  }, [])

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Mis Pedidos</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-medium text-foreground">No tienes pedidos aún</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Cuando realices una compra, aparecerá aquí.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Ir a la tienda</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = STATUS_LABELS[order.status.toLowerCase()] || {
              label: order.status,
              variant: 'secondary' as const,
            }
            return (
              <div
                key={order.id}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        Pedido #{order.number}
                      </span>
                      <Badge variant={status.variant} className="text-xs">
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.order_date)} · {order.items.length}{' '}
                      {order.items.length === 1 ? 'producto' : 'productos'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      {formatPrice(order.total.grand_total.value)}
                    </span>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/customer/account/orders/${order.number}`}>
                        Ver detalle
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
