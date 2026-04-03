'use client'

import Link from 'next/link'
import { Package, MapPin, Settings, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCustomer } from '@/src/hooks/use-customer'
import { Skeleton } from '@/components/ui/skeleton'

export function AccountOverview() {
  const { customer, isLoading } = useCustomer()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const QUICK_LINKS = [
    {
      href: '/customer/account/orders',
      icon: Package,
      title: 'Mis Pedidos',
      description: 'Revisa el estado y el historial de tus compras',
    },
    {
      href: '/customer/account/addresses',
      icon: MapPin,
      title: 'Mis Direcciones',
      description: 'Administra tus direcciones de envío y facturación',
    },
    {
      href: '/customer/account/profile',
      icon: Settings,
      title: 'Editar Perfil',
      description: 'Actualiza tu información personal y contraseña',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Hola, {customer?.firstname}
        </h1>
        <p className="text-sm text-muted-foreground">
          Bienvenido a tu panel de cuenta
        </p>
      </div>

      {/* Info card */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Información de contacto
        </h2>
        <div className="space-y-1 text-sm">
          <p className="font-medium text-foreground">
            {customer?.firstname} {customer?.lastname}
          </p>
          <p className="text-muted-foreground">{customer?.email}</p>
          {customer?.is_subscribed && (
            <p className="text-xs text-muted-foreground">Suscrito al newsletter</p>
          )}
        </div>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/customer/account/profile">
            Editar información
            <ChevronRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {QUICK_LINKS.map(({ href, icon: Icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted group-hover:bg-background transition-colors">
              <Icon className="h-5 w-5 text-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
