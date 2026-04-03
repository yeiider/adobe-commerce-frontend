'use client'

import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/src/hooks/use-cart'
import { useCartQueue } from '@/src/components/providers/CartQueueProvider'
import { usePriceFormatter } from '@/src/components/providers/StoreProvider'
import { CartItem } from './CartItem'
import { EmptyCart } from './EmptyCart'
import Link from 'next/link'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export function MiniCart() {
  const { cart, itemCount, isLoading } = useCart()
  const { isAdding } = useCartQueue()
  const formatPrice = usePriceFormatter()
  
  const total = cart?.prices?.grand_total?.value || 0
  const isCartEmpty = !cart || !cart.items || cart.items.length === 0

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group" aria-label="Carrito">
          <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-in zoom-in items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {itemCount}
            </span>
          )}
          {isAdding && (
            <span className="absolute right-0 top-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Mi Carrito ({itemCount})</SheetTitle>
        </SheetHeader>
        
        {isCartEmpty && !isLoading ? (
          <div className="flex flex-1 items-center justify-center px-6">
            <EmptyCart message="Tu carrito está vacío. ¡Descubre nuestros productos!" />
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-6 pl-6 pt-4">
              <div className="flex flex-col gap-2">
                {cart?.items?.map((item) => (
                  <CartItem key={item.uid} item={item} />
                ))}
              </div>
            </ScrollArea>
            
            <div className="px-6 pb-6 pt-4">
              <Separator className="mb-4" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Total</span>
                <span className="text-lg font-bold">{formatPrice(total)}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">Ir a Pagar</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/cart">Ver Carrito Completo</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
