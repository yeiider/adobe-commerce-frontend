'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, LogOut, Package, MapPin, Settings, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCustomer } from '@/src/hooks/use-customer'
import { toast } from 'sonner'

export function AccountButton() {
  const { customer, isAuthenticated, isInitializing, isLoading, logout } = useCustomer()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    toast.success('Sesión cerrada correctamente')
    router.push('/')
    router.refresh()
  }

  if (isInitializing || isLoading) {
    return (
      <Button variant="ghost" size="icon" aria-label="Mi cuenta" disabled>
        <User className="h-5 w-5" />
      </Button>
    )
  }

  if (!isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Mi cuenta">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/customer/login" className="cursor-pointer">
              Iniciar Sesión
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/customer/register" className="cursor-pointer">
              Crear Cuenta
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1 px-2" aria-label="Mi cuenta">
          <User className="h-5 w-5" />
          <span className="hidden max-w-[80px] truncate text-sm md:block">
            {customer?.firstname}
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">
            {customer?.firstname} {customer?.lastname}
          </p>
          <p className="truncate text-xs text-muted-foreground">{customer?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/customer/account" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Mi Cuenta
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/customer/account/orders" className="cursor-pointer">
            <Package className="mr-2 h-4 w-4" />
            Mis Pedidos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/customer/account/addresses" className="cursor-pointer">
            <MapPin className="mr-2 h-4 w-4" />
            Mis Direcciones
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
