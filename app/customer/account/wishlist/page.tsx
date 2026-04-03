'use client'

import React from 'react'
import { useWishlist } from '@/src/hooks/use-wishlist'
import { ProductCard } from '@/src/components/category/ProductCard'
import { Button } from '@/components/ui/button'
import { Share2, Trash2, HeartCrack } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export default function WishlistPage() {
  const { wishlist, isLoading, removeProduct } = useWishlist()

  const handleShare = () => {
    if (!wishlist?.sharing_code) {
      toast.error('No se pudo generar el enlace de compartir.')
      return
    }
    const shareUrl = `${window.location.origin}/wishlist/shared/${wishlist.sharing_code}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('¡Enlace de compartir copiado al portapapeles!')
  }

  const handleRemove = async (itemId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const success = await removeProduct(itemId)
    if (success) {
      toast.success('Producto eliminado de favoritos')
    } else {
      toast.error('Error al eliminar el producto')
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Mis Favoritos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona los productos que has guardado.
          </p>
        </div>
        <Button onClick={handleShare} variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Compartir Lista</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] w-full rounded-xl" />
          ))}
        </div>
      ) : !wishlist?.items_v2?.items?.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center bg-card">
          <HeartCrack className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-1 text-lg font-semibold text-foreground">Tu lista está vacía</h3>
          <p className="text-sm text-muted-foreground">
            Aún no has guardado ningún producto en tus favoritos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.items_v2.items.map((item) => (
            <div key={item.id} className="relative group/wishlist rounded-xl">
              <ProductCard product={item.product as any} />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 z-20 h-8 w-8 rounded-full opacity-100 shadow-sm md:opacity-0 md:group-hover/wishlist:opacity-100 transition-opacity"
                onClick={(e) => handleRemove(item.id, e)}
                aria-label="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
