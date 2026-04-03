'use client'

/**
 * SessionGuard
 * Listens for auth:session-expired events dispatched by the GraphQL client
 * when Magento returns an authorization error. Clears the stored token,
 * shows a toast, and redirects the user to the login page.
 */

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { clearStoredCustomerToken } from '@/src/services/customer.service'

// Pages where we should NOT redirect to login (auth pages themselves)
const AUTH_PATHS = ['/customer/login', '/customer/register', '/customer/forgot-password', '/customer/reset-password']

export function SessionGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const handledRef = useRef(false)

  useEffect(() => {
    function handleSessionExpired() {
      // Avoid handling the same expiry event twice in quick succession
      if (handledRef.current) return
      handledRef.current = true

      // Clear token from localStorage and cookie
      clearStoredCustomerToken()

      toast.warning('Tu sesión ha expirado. Por favor inicia sesión nuevamente.', {
        duration: 5000,
        id: 'session-expired',
      })

      // Only redirect if not already on an auth page
      if (!AUTH_PATHS.some((p) => pathname.startsWith(p))) {
        const redirect = encodeURIComponent(pathname)
        router.push(`/customer/login?redirect=${redirect}`)
      }

      // Allow handling again after a cooldown (in case of multiple expired requests)
      setTimeout(() => {
        handledRef.current = false
      }, 10_000)
    }

    window.addEventListener('auth:session-expired', handleSessionExpired)
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired)
  }, [router, pathname])

  return null
}
