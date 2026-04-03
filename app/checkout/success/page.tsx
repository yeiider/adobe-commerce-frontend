'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  if (!orderId) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Pedido no encontrado</h1>
        <p className="text-muted-foreground mb-8">
          No pudimos encontrar el número de pedido en esta página.
        </p>
        <Button asChild>
          <Link href="/">Volver a la tienda</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-24 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="flex justify-center mb-8">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight">¡Gracias por tu compra!</h1>
        <p className="text-lg text-muted-foreground">
          Tu pedido ha sido procesado exitosamente y estamos preparándolo para el envío.
        </p>

        <div className="bg-card border rounded-lg p-6 mt-8 flex flex-col items-center">
          <Package className="h-8 w-8 text-primary mb-3" />
          <h2 className="text-xl font-medium mb-1">Número de Orden</h2>
          <span className="text-3xl font-bold font-mono tracking-wider">{orderId}</span>
          <p className="text-sm text-muted-foreground mt-4">
            Hemos enviado un correo electrónico de confirmación con los detalles de tu pedido.
          </p>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="h-12 px-8">
            <Link href="/customer/account/orders">
              Ver mis pedidos
            </Link>
          </Button>
          <Button asChild className="h-12 px-8">
            <Link href="/">
              Seguir comprando <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
