'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useWishlist } from '@/src/hooks/use-wishlist'
import { useCustomer } from '@/src/hooks/use-customer'
import { useCart } from '@/src/hooks/use-cart'
import { formatPrice } from '@/src/utils/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Heart,
  ShoppingCart,
  Trash2,
  Share2,
  Loader2,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { config } from '@/src/config/env'
import type { WishlistItem } from '@/src/types/customer.types'

export function WishlistClient() {
  const { isAuthenticated, isInitializing } = useCustomer()
  const { defaultWishlist, isLoading, removeProduct, addItemsToCart, refresh } = useWishlist()
  const { addItems, refresh: refreshCart } = useCart()
  
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set())
  const [addingAllToCart, setAddingAllToCart] = useState(false)
  const [copied, setCopied] = useState(false)

  // Handle remove from wishlist
  const handleRemove = async (itemId: string, productName: string) => {
    setRemovingItems(prev => new Set(prev).add(itemId))
    try {
      const success = await removeProduct(itemId)
      if (success) {
        toast.success(`${productName} eliminado de favoritos`)
      } else {
        toast.error('Error al eliminar el producto')
      }
    } catch {
      toast.error('Error al eliminar el producto')
    } finally {
      setRemovingItems(prev => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  // Handle add single item to cart
  const handleAddToCart = async (item: WishlistItem) => {
    const itemId = item.id
    setAddingToCart(prev => new Set(prev).add(itemId))
    try {
      // Use the cart hook to add directly
      const result = await addItems([{ sku: item.product.sku, quantity: item.quantity }])
      if (result) {
        toast.success(`${item.product.name} agregado al carrito`)
        refreshCart()
      } else {
        toast.error('Error al agregar al carrito')
      }
    } catch {
      toast.error('Error al agregar al carrito')
    } finally {
      setAddingToCart(prev => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  // Handle add all items to cart
  const handleAddAllToCart = async () => {
    if (!defaultWishlist?.items_v2.items.length) return
    
    setAddingAllToCart(true)
    try {
      const wishlistItemIds = defaultWishlist.items_v2.items.map(item => item.id)
      const result = await addItemsToCart(wishlistItemIds)
      
      if (result.success) {
        toast.success('Todos los productos agregados al carrito')
        refreshCart()
        refresh()
      } else if (result.errors.length > 0) {
        toast.error(result.errors[0].message || 'Error al agregar productos al carrito')
      } else {
        toast.error('Error al agregar productos al carrito')
      }
    } catch {
      toast.error('Error al agregar productos al carrito')
    } finally {
      setAddingAllToCart(false)
    }
  }

  // Handle share wishlist
  const handleShare = async () => {
    if (!defaultWishlist?.sharing_code) {
      toast.error('No se puede compartir la lista')
      return
    }

    const shareUrl = `${config.seo.siteUrl}/wishlist/shared/${defaultWishlist.sharing_code}`
    
    // Try native share first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi Lista de Deseos',
          text: 'Mira mi lista de productos favoritos',
          url: shareUrl,
        })
        return
      } catch {
        // User cancelled or error, fall through to clipboard
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Enlace copiado al portapapeles')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Error al copiar el enlace')
    }
  }

  // Loading state
  if (isInitializing || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Heart className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Lista de Deseos</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Inicia sesion para ver y gestionar tu lista de productos favoritos.
          </p>
          <Button asChild>
            <Link href="/customer/login?redirect=/wishlist">
              Iniciar Sesion
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const items = defaultWishlist?.items_v2.items || []
  const itemCount = defaultWishlist?.items_count || 0

  // Empty wishlist
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Heart className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Tu lista esta vacia</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Aun no has agregado productos a tu lista de deseos. Explora nuestra tienda y guarda tus productos favoritos.
          </p>
          <Button asChild>
            <Link href="/">
              Explorar Productos
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lista de Deseos</h1>
          <p className="text-muted-foreground mt-1">
            {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleShare}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copiado
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Compartir
              </>
            )}
          </Button>
          <Button
            onClick={handleAddAllToCart}
            disabled={addingAllToCart}
            className="gap-2"
          >
            {addingAllToCart ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            Agregar Todo al Carrito
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <WishlistItemCard
            key={item.id}
            item={item}
            onRemove={handleRemove}
            onAddToCart={handleAddToCart}
            isRemoving={removingItems.has(item.id)}
            isAddingToCart={addingToCart.has(item.id)}
          />
        ))}
      </div>
    </div>
  )
}

// Wishlist Item Card Component
interface WishlistItemCardProps {
  item: WishlistItem
  onRemove: (itemId: string, productName: string) => void
  onAddToCart: (item: WishlistItem) => void
  isRemoving: boolean
  isAddingToCart: boolean
}

function WishlistItemCard({
  item,
  onRemove,
  onAddToCart,
  isRemoving,
  isAddingToCart,
}: WishlistItemCardProps) {
  const { product } = item
  const isOutOfStock = product.stock_status === 'OUT_OF_STOCK'
  
  const minimumPrice = product.price_range?.minimum_price
  const hasDiscount = minimumPrice?.regular_price.value !== minimumPrice?.final_price.value

  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Link href={`/${product.url_key}`} className="block h-full">
          {product.thumbnail?.url ? (
            <Image
              src={product.thumbnail.url}
              alt={product.thumbnail.label || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain object-center p-4 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm text-muted-foreground">Sin imagen</span>
            </div>
          )}
        </Link>

        {/* Badges */}
        {isOutOfStock && (
          <div className="absolute left-2 top-2 rounded bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
            Agotado
          </div>
        )}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            Oferta
          </div>
        )}

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={() => onRemove(item.id, product.name)}
          disabled={isRemoving}
          aria-label={`Eliminar ${product.name} de favoritos`}
        >
          {isRemoving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 text-destructive" />
          )}
        </Button>
      </div>

      <CardContent className="p-4">
        {/* Product Name */}
        <Link href={`/${product.url_key}`} className="block">
          <h3 className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        {minimumPrice && (
          <div className="mt-2 flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {formatPrice(minimumPrice.final_price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(minimumPrice.regular_price)}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button
            className="flex-1 gap-2"
            onClick={() => onAddToCart(item)}
            disabled={isOutOfStock || isAddingToCart}
          >
            {isAddingToCart ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            {isOutOfStock ? 'Agotado' : 'Agregar'}
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link href={`/${product.url_key}`} aria-label={`Ver detalles de ${product.name}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
