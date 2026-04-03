'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LoadingLink } from '@/src/components/common/LoadingLink'
import type { NavigationItem } from '@/src/types/category.types'

interface NavigationMenuProps {
  items: NavigationItem[] | null
}

export function NavigationMenu({ items }: NavigationMenuProps) {
  if (!items || items.length === 0) {
    return (
      <nav className="flex items-center gap-6">
        <span className="text-sm text-muted-foreground">Cargando navegación...</span>
      </nav>
    )
  }

  return (
    <nav className="flex items-center" role="navigation" aria-label="Navegación principal">
      <ul className="flex items-center gap-1">
        {items.map((item, index) => (
          <NavItem key={`nav-${item.url_path || item.name}-${index}`} item={item} />
        ))}
      </ul>
    </nav>
  )
}

interface NavItemProps {
  item: NavigationItem
}

function NavItem({ item }: NavItemProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()
  const hasChildren = item.children && item.children.length > 0

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  return (
    <li
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <LoadingLink
        href={item.url_path ? `/${item.url_path}` : '#'}
        loadingMessage={`Cargando ${item.name}...`}
        className={cn(
          'flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground',
          isOpen && 'text-foreground'
        )}
      >
        {item.name}
        {hasChildren && (
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        )}
      </LoadingLink>

      {/* Dropdown Menu */}
      {hasChildren && (
        <div
          className={cn(
            'absolute left-0 top-full z-50 min-w-[240px] origin-top-left transition-all duration-200',
            isOpen
              ? 'visible scale-100 opacity-100'
              : 'invisible scale-95 opacity-0'
          )}
        >
          <div className="mt-2 rounded-lg border border-border bg-background p-2 shadow-lg">
            <ul className="space-y-1">
              {item.children?.map((child, index) => (
                <DropdownItem key={`dropdown-${child.url_path || child.name}-${index}`} item={child} />
              ))}
            </ul>

            {/* Ver todos link */}
            {item.url_path && (
              <div className="mt-2 border-t border-border pt-2">
                <LoadingLink
                  href={`/${item.url_path}`}
                  loadingMessage={`Cargando ${item.name}...`}
                  className="block px-3 py-2 text-sm font-medium text-primary hover:underline"
                >
                  Ver todo en {item.name}
                </LoadingLink>
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

interface DropdownItemProps {
  item: NavigationItem
}

function DropdownItem({ item }: DropdownItemProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const hasChildren = item.children && item.children.length > 0

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <LoadingLink
        href={item.url_path ? `/${item.url_path}` : '#'}
        loadingMessage={`Cargando ${item.name}...`}
        className={cn(
          'flex items-center justify-between rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground',
          isOpen && 'bg-accent text-foreground'
        )}
      >
        <span>{item.name}</span>
        {hasChildren && <ChevronDown className="h-4 w-4 -rotate-90" />}
      </LoadingLink>

      {/* Nested Dropdown */}
      {hasChildren && (
        <div
          className={cn(
            'absolute left-full top-0 z-50 min-w-[200px] transition-all duration-200',
            isOpen
              ? 'visible scale-100 opacity-100'
              : 'invisible scale-95 opacity-0'
          )}
        >
          <div className="ml-2 rounded-lg border border-border bg-background p-2 shadow-lg">
            <ul className="space-y-1">
              {item.children?.map((child, index) => (
                <li key={`nested-${child.url_path || child.name}-${index}`}>
                  <LoadingLink
                    href={child.url_path ? `/${child.url_path}` : '#'}
                    loadingMessage={`Cargando ${child.name}...`}
                    className="block rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {child.name}
                  </LoadingLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  )
}
