'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCartQueue } from '@/src/components/providers/CartQueueProvider'

interface AddToCartButtonProps {
  sku: string
  currentVariant?: any | null
  isConfigurable?: boolean
  isOutOfStock?: boolean
  quantity?: number
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function AddToCartButton({
  sku,
  currentVariant = null,
  isConfigurable = false,
  isOutOfStock = false,
  quantity = 1,
  size = 'default',
  className,
}: AddToCartButtonProps) {
  const { addToCartQueue, isAdding } = useCartQueue()

  const skuToUse = currentVariant ? currentVariant.product.sku : sku
  const requiresVariant = isConfigurable && !currentVariant
  const isDisabled = isOutOfStock || requiresVariant || isAdding

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!skuToUse || isDisabled) return
    addToCartQueue([{ sku: skuToUse, quantity }])
  }

  return (
    <Button
      size={size}
      className={className}
      variant="default"
      disabled={isDisabled}
      onClick={handleClick}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isOutOfStock ? 'Agotado' : requiresVariant ? 'Selecciona una opción' : 'Añadir al Carrito'}
    </Button>
  )
}
