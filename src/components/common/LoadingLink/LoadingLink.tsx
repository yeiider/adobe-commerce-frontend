'use client'

/**
 * LoadingLink Component
 * 
 * A Next.js Link component that triggers the global loader on click.
 * Useful for navigation links that may take time to load.
 * 
 * @example
 * <LoadingLink href="/category/electronics" loadingMessage="Cargando categoría...">
 *   Electronics
 * </LoadingLink>
 */

import { type ComponentProps, useCallback } from 'react'
import Link from 'next/link'
import { useGlobalLoading } from '@/src/components/providers/LoadingProvider'

export interface LoadingLinkProps extends ComponentProps<typeof Link> {
  /** Message to show in the loader */
  loadingMessage?: string
  /** Whether to show loader (default: true) */
  showLoader?: boolean
}

export function LoadingLink({
  children,
  loadingMessage,
  showLoader = true,
  onClick,
  ...props
}: LoadingLinkProps) {
  const { startNavigationLoading } = useGlobalLoading()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Don't trigger for modified clicks (new tab, etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        onClick?.(e)
        return
      }

      // Start navigation loading (auto-closes on route change)
      if (showLoader) {
        startNavigationLoading(loadingMessage)
      }

      // Call original onClick if provided
      onClick?.(e)
    },
    [onClick, showLoader, startNavigationLoading, loadingMessage]
  )

  return (
    <Link onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

export default LoadingLink
