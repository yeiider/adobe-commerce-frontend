'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyCartProps {
  message?: string
}

export function EmptyCart({ message = 'Tu carrito está vacío.' }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center h-full">
      <div className="rounded-full bg-muted p-6">
        <ShoppingCart className="h-12 w-12 text-muted-foreground opacity-50" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{message}</h3>
        <p className="text-sm text-muted-foreground">
          Parece que aún no has añadido nada a tu carrito.
        </p>
      </div>
      <Button asChild className="mt-4">
        <Link href="/">Continuar Comprando</Link>
      </Button>
    </div>
  )
}
