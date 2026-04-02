'use client'

import * as React from 'react'
import Link from 'next/link'
import { X, ChevronRight, ChevronLeft, User, Heart, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { config } from '@/src/config/env'
import type { NavigationItem } from '@/src/types/category.types'

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

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
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
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 transition-opacity duration-300',
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col bg-background shadow-xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          {activeMenu ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver
            </Button>
          ) : (
            <span className="font-semibold">{config.seo.siteName}</span>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar menú">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Current Category Title */}
        {activeMenu && (
          <div className="border-b border-border bg-muted px-4 py-3">
            <Link
              href={`/${activeMenu.url_path}`}
              onClick={onClose}
              className="text-lg font-semibold text-foreground hover:text-primary"
            >
              {activeMenu.name}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              Ver todos los productos
            </p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-border">
            {currentItems.map((item) => (
              <MobileMenuItem
                key={item.uid}
                item={item}
                onNavigate={handleNavigate}
                onClose={onClose}
              />
            ))}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-border p-4">
          <div className="space-y-2">
            <Link
              href="/customer/account"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <User className="h-5 w-5" />
              Mi Cuenta
            </Link>
            {config.features.enableWishlist && (
              <Link
                href="/wishlist"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Heart className="h-5 w-5" />
                Lista de Deseos
              </Link>
            )}
            <Link
              href="/store-locator"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <MapPin className="h-5 w-5" />
              Encuentra una Tienda
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Phone className="h-5 w-5" />
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </>
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
      <Link
        href={`/${item.url_path}`}
        onClick={onClose}
        className="flex items-center px-4 py-3 text-foreground transition-colors hover:bg-accent"
      >
        <span className="font-medium">{item.name}</span>
      </Link>
    </li>
  )
}
