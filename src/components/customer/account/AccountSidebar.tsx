'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User, Package, MapPin, Settings, LogOut, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCustomer } from '@/src/hooks/use-customer'
import { toast } from 'sonner'

const NAV_ITEMS = [
  { href: '/customer/account', label: 'Mi Cuenta', icon: User, exact: true },
  { href: '/customer/account/orders', label: 'Mis Pedidos', icon: Package, exact: false },
  { href: '/customer/account/wishlist', label: 'Mis Favoritos', icon: Heart, exact: false },
  { href: '/customer/account/addresses', label: 'Mis Direcciones', icon: MapPin, exact: false },
  { href: '/customer/account/profile', label: 'Editar Perfil', icon: Settings, exact: false },
]

export function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { customer, logout } = useCustomer()

  const handleLogout = async () => {
    await logout()
    toast.success('Sesión cerrada correctamente')
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="w-full lg:w-64 shrink-0">
      {/* Customer info */}
      <div className="mb-4 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
            {customer?.firstname?.[0]?.toUpperCase()}
            {customer?.lastname?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {customer?.firstname} {customer?.lastname}
            </p>
            <p className="truncate text-xs text-muted-foreground">{customer?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="rounded-xl border border-border bg-card overflow-hidden">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted',
              isActive(href, exact)
                ? 'bg-muted font-medium text-foreground border-l-2 border-foreground'
                : 'text-muted-foreground border-l-2 border-transparent'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
        <div className="border-t border-border">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-destructive transition-colors hover:bg-destructive/10 border-l-2 border-transparent"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </aside>
  )
}
