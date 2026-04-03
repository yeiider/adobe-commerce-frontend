'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCustomer } from '@/src/hooks/use-customer'
import { Loader2 } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing, isLoading } = useCustomer()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Wait until localStorage has been read before evaluating auth state
    if (!isInitializing && !isLoading && !isAuthenticated) {
      router.replace(`/customer/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, isInitializing, isLoading, pathname, router])

  if (isInitializing || isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
