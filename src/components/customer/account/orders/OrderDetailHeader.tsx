'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { CustomerOrder } from '@/src/types/customer.types'

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  processing: { label: 'En proceso', variant: 'default' },
  complete: { label: 'Completado', variant: 'outline' },
  canceled: { label: 'Cancelado', variant: 'destructive' },
  closed: { label: 'Cerrado', variant: 'secondary' },
  holded: { label: 'En espera', variant: 'secondary' },
}

interface OrderDetailHeaderProps {
  order: CustomerOrder
}

export function OrderDetailHeader({ order }: OrderDetailHeaderProps) {
  const status = STATUS_LABELS[order.status.toLowerCase()] ?? {
    label: order.status,
    variant: 'secondary' as const,
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/customer/account/orders">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Mis Pedidos
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Pedido #{order.number}
            </h1>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Realizado el {formatDate(order.order_date)}
          </p>
        </div>
      </div>
    </div>
  )
}
