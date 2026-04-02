'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ShoppingCart, User, Search, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NavigationMenu } from './NavigationMenu'
import { MobileMenu } from './MobileMenu'
import { SearchBar } from './SearchBar'
import { config } from '@/src/config/env'
import type { NavigationItem } from '@/src/types/category.types'

interface HeaderProps {
  navigation: NavigationItem[] | null
}

export function Header({ navigation }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="hidden bg-muted py-2 md:block">
        <div className="container mx-auto flex items-center justify-between px-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Bienvenido a nuestra tienda</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/store-locator" className="hover:text-foreground">
              Encuentra una tienda
            </Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-foreground">
              Contacto
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-foreground">
              {config.seo.siteName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden flex-1 justify-center md:flex">
            <NavigationMenu items={navigation} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            {config.features.enableWishlist && (
              <Button variant="ghost" size="icon" asChild aria-label="Lista de deseos">
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
            )}

            {/* Account */}
            <Button variant="ghost" size="icon" asChild aria-label="Mi cuenta">
              <Link href="/customer/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" asChild aria-label="Carrito">
              <Link href="/checkout/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  0
                </span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        items={navigation}
      />
    </header>
  )
}
