'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCustomer } from '@/src/hooks/use-customer'
import { useWishlist } from '@/src/hooks/use-wishlist'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  sku: string
  className?: string
}

export function WishlistButton({ sku, className }: WishlistButtonProps) {
  const { isAuthenticated, isInitializing } = useCustomer()
  const { isInWishlist, getWishlistItemId, addProduct, removeProduct, isLoading } = useWishlist()
  const [isProcessing, setIsProcessing] = useState(false)

  // Don't render anything until we know auth state, and hide if not logged in
  if (isInitializing || !isAuthenticated) return null

  const inWishlist = isInWishlist(sku)
  const disabled = isLoading || isProcessing

  const handleClick = async () => {
    setIsProcessing(true)
    try {
      if (inWishlist) {
        const itemId = getWishlistItemId(sku)
        if (!itemId) return
        const success = await removeProduct(itemId)
        if (success) {
          toast.success('Eliminado de favoritos')
        } else {
          toast.error('No se pudo eliminar de favoritos')
        }
      } else {
        const result = await addProduct(sku)
        if (result) {
          toast.success('Añadido a favoritos')
        } else {
          toast.error('No se pudo añadir a favoritos')
        }
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn('h-12 w-12 shrink-0', className)}
      onClick={handleClick}
      disabled={disabled}
      aria-label={inWishlist ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
      title={inWishlist ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-colors',
          inWishlist ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'
        )}
      />
    </Button>
  )
}
