'use client'

import React from 'react'
import Link from 'next/link'
import { useCart } from '@/src/hooks/use-cart'
import { usePriceFormatter } from '@/src/components/providers/StoreProvider'
import { CartItem } from '@/src/components/cart/CartItem'
import { EmptyCart } from '@/src/components/cart/EmptyCart'
import { CouponForm } from '@/src/components/cart/CouponForm'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ShieldCheck, Truck, ArrowLeft } from 'lucide-react'

export default function CartPage() {
  const { cart, isLoading, itemCount } = useCart()
  const formatPrice = usePriceFormatter()

  const isCartEmpty = !cart || !cart.items || cart.items.length === 0

  if (isLoading && isCartEmpty) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="text-muted-foreground animate-pulse">Cargando tu carrito...</p>
        </div>
      </div>
    )
  }

  if (isCartEmpty) {
    return (
      <div className="container mx-auto px-4 py-16 h-[60vh] flex items-center justify-center">
        <EmptyCart message="Tu carrito de compras está vacío." />
      </div>
    )
  }

  const { prices } = cart
  const subtotal = prices?.subtotal_excluding_tax?.value || 0
  const subtotalInclTax = prices?.subtotal_including_tax?.value || subtotal
  const grandTotal = prices?.grand_total?.value || 0

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tu Carrito</h1>
        <Link 
          href="/" 
          className="group flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Seguir comprando
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-8">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="hidden border-b px-6 py-4 text-sm font-medium text-muted-foreground sm:grid sm:grid-cols-12">
              <div className="col-span-7">Producto</div>
              <div className="col-span-3 text-center">Cantidad</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>
            
            <div className="divide-y px-6">
              {cart.items.map((item) => (
                <CartItem 
                  key={item.uid} 
                  item={item} 
                  className="sm:block"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold tracking-tight mb-6">Resumen del pedido</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({itemCount} productos)</span>
                <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
              </div>
              
              {prices?.applied_taxes?.map((tax, index) => (
                <div key={index} className="flex justify-between text-muted-foreground">
                  <span>{tax.label}</span>
                  <span className="font-medium text-foreground">{formatPrice(tax.amount.value)}</span>
                </div>
              ))}

              {prices?.discounts?.map((discount, index) => (
                <div key={index} className="flex justify-between text-emerald-600">
                  <span>{discount.label}</span>
                  <span className="font-medium">-{formatPrice(discount.amount.value)}</span>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Total a Pagar</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Button size="lg" className="w-full mt-8 gap-2 text-base font-semibold" asChild>
              <Link href="/checkout">
                Ir al Checkout
              </Link>
            </Button>
          </div>

          {/* Formulario de Cupón */}
          <CouponForm />

          {/* Trust Badges */}
          <div className="rounded-lg border bg-muted/50 p-6 flex flex-col gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span>Compra 100% segura y protegida</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <span>Envío gratis a partir de $150.000 COP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
