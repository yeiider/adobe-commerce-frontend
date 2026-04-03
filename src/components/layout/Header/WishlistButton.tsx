'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWishlist } from '@/src/hooks/use-wishlist'
import { useCustomer } from '@/src/hooks/use-customer'

export function WishlistButton() {
  const { isAuthenticated } = useCustomer()
  const { itemCount } = useWishlist()

  return (
    <Button variant="ghost" size="icon" asChild aria-label="Lista de deseos" className="relative group">
      <Link href="/wishlist">
        <Heart className="h-5 w-5 transition-transform group-hover:scale-110" />
        {isAuthenticated && itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-in zoom-in items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </Link>
    </Button>
  )
}
