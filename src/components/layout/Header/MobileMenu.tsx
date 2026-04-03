'use client'

import * as React from 'react'
import Link from 'next/link'
import { X, ChevronRight, ChevronLeft, User, Heart, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { config } from '@/src/config/env'
import { LoadingLink } from '@/src/components/common/LoadingLink'
import type { NavigationItem } from '@/src/types/category.types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  items: NavigationItem[] | null
}

export function MobileMenu({ isOpen, onClose, items }: MobileMenuProps) {
  const [activeMenu, setActiveMenu] = React.useState<NavigationItem | null>(null)
  const [menuHistory, setMenuHistory] = React.useState<NavigationItem[]>([])

  // Reset state when menu closes
  React.useEffect(() => {
    if (!isOpen) {
      setActiveMenu(null)
      setMenuHistory([])
    }
  }, [isOpen])

  const handleNavigate = (item: NavigationItem) => {
    if (item.children && item.children.length > 0) {
      setMenuHistory((prev) => [...prev, ...(activeMenu ? [activeMenu] : [])])
      setActiveMenu(item)
    } else {
      onClose()
    }
  }

  const handleBack = () => {
    if (menuHistory.length > 0) {
      const newHistory = [...menuHistory]
      const previousMenu = newHistory.pop()
      setMenuHistory(newHistory)
      setActiveMenu(previousMenu || null)
    } else {
      setActiveMenu(null)
    }
  }

  const currentItems = activeMenu?.children || items || []

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="left" 
        className="flex w-[300px] flex-col p-0 sm:w-[350px]"
      >
        {/* Header */}
        <SheetHeader className="border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            {activeMenu ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="gap-2 -ml-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Volver
              </Button>
            ) : (
              <SheetTitle className="text-base">
                {config.seo.siteName}
              </SheetTitle>
            )}
          </div>
        </SheetHeader>

        {/* Current Category Title */}
        {activeMenu && (
          <div className="border-b border-border bg-muted/50 px-4 py-3">
            <LoadingLink
              href={activeMenu.url_path ? `/${activeMenu.url_path}` : '#'}
              onClick={onClose}
              loadingMessage={`Cargando ${activeMenu.name}...`}
              className="text-base font-semibold text-foreground hover:text-primary"
            >
              {activeMenu.name}
            </LoadingLink>
            <p className="mt-1 text-xs text-muted-foreground">
              Ver todos los productos
            </p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-border">
            {currentItems.map((item) => (
              <MobileMenuItem
                key={item.url_path || item.name}
                item={item}
                onNavigate={handleNavigate}
                onClose={onClose}
              />
            ))}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto border-t border-border bg-muted/30 p-4">
          <nav className="grid grid-cols-2 gap-2">
            <Link
              href="/customer/account"
              onClick={onClose}
              className="flex flex-col items-center gap-1.5 rounded-lg p-3 text-center text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              <User className="h-5 w-5" />
              <span>Mi Cuenta</span>
            </Link>
            {config.features.enableWishlist && (
              <Link
                href="/wishlist"
                onClick={onClose}
                className="flex flex-col items-center gap-1.5 rounded-lg p-3 text-center text-xs font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Heart className="h-5 w-5" />
                <span>Favoritos</span>
              </Link>
            )}
            <Link
              href="/store-locator"
              onClick={onClose}
              className="flex flex-col items-center gap-1.5 rounded-lg p-3 text-center text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              <MapPin className="h-5 w-5" />
              <span>Tiendas</span>
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="flex flex-col items-center gap-1.5 rounded-lg p-3 text-center text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Phone className="h-5 w-5" />
              <span>Contacto</span>
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface MobileMenuItemProps {
  item: NavigationItem
  onNavigate: (item: NavigationItem) => void
  onClose: () => void
}

function MobileMenuItem({ item, onNavigate, onClose }: MobileMenuItemProps) {
  const hasChildren = item.children && item.children.length > 0

  if (hasChildren) {
    return (
      <li>
        <button
          onClick={() => onNavigate(item)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-foreground transition-colors hover:bg-accent"
        >
          <span className="font-medium">{item.name}</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </li>
    )
  }

  return (
    <li>
      <LoadingLink
        href={item.url_path ? `/${item.url_path}` : '#'}
        onClick={onClose}
        loadingMessage={`Cargando ${item.name}...`}
        className="flex items-center px-4 py-3 text-foreground transition-colors hover:bg-accent"
      >
        <span className="font-medium">{item.name}</span>
      </LoadingLink>
    </li>
  )
}
