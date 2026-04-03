'use client'

import { MapPin } from 'lucide-react'
import type { OrderAddress } from '@/src/types/customer.types'

interface OrderAddressCardProps {
  title: string
  address: OrderAddress
}

export function OrderAddressCard({ title, address }: OrderAddressCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>

      <address className="not-italic space-y-0.5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">
          {address.firstname} {address.lastname}
        </p>
        {address.street.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
        <p>
          {address.city}
          {address.region ? `, ${address.region}` : ''}
          {address.postcode ? ` ${address.postcode}` : ''}
        </p>
        <p>{address.country_code}</p>
        {address.telephone && <p>Tel: {address.telephone}</p>}
      </address>
    </div>
  )
}
