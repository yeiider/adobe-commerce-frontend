'use client'

/**
 * Loading Provider
 * 
 * Global loading state management with automatic route change detection.
 * Provides a context for controlling the global loader across the application.
 * 
 * Features:
 * - Automatic loading state on route changes
 * - Manual loading control via hooks
 * - Request tracking for parallel requests
 * - Configurable minimum display time to prevent flash
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { GlobalLoader, type GlobalLoaderProps } from '@/src/components/common/GlobalLoader/GlobalLoader'

/**
 * Loading Context Type
 */
export interface LoadingContextType {
  /** Whether any loading is active */
  isLoading: boolean
  /** Current loading message */
  message: string | null
  /** Current progress (0-100) */
  progress: number | null
  /** Start loading with optional message */
  startLoading: (message?: string) => void
  /** Stop loading */
  stopLoading: () => void
  /** Set loading message */
  setMessage: (message: string | null) => void
  /** Set progress (0-100) */
  setProgress: (progress: number | null) => void
  /** Track an async operation */
  trackPromise: <T>(promise: Promise<T>, message?: string) => Promise<T>
  /** Start navigation loading (auto-closes on route change) */
  startNavigationLoading: (message?: string) => void
}

const LoadingContext = createContext<LoadingContextType | null>(null)

/**
 * Loading Provider Props
 */
export interface LoadingProviderProps {
  children: ReactNode
  /** Loader visual configuration */
  loaderProps?: Omit<GlobalLoaderProps, 'isVisible' | 'message' | 'progress'>
  /** Minimum time to show loader (prevents flash) */
  minDisplayTime?: number
  /** Enable automatic route change detection */
  detectRouteChanges?: boolean
}

/**
 * Loading Provider Component
 */
export function LoadingProvider({
  children,
  loaderProps,
  minDisplayTime = 200,
  detectRouteChanges = true,
}: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)

  // Track active requests/operations
  const activeRequests = useRef(0)
  const loadingStartTime = useRef<number | null>(null)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Route change detection
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const previousUrl = useRef<string | null>(null)
  const isNavigating = useRef(false)

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  // Detect route changes - this effect runs AFTER navigation completes
  useEffect(() => {
    if (!detectRouteChanges) return

    const currentUrl = `${pathname}?${searchParams?.toString() || ''}`

    // If we were navigating and URL has changed, hide the loader
    if (isNavigating.current || (previousUrl.current !== null && previousUrl.current !== currentUrl)) {
      isNavigating.current = false
      // Reset active requests since navigation completed
      activeRequests.current = 0
      
      // Small delay to ensure content is rendered
      const timer = setTimeout(() => {
        setIsLoading(false)
        setMessage(null)
        setProgress(null)
        loadingStartTime.current = null
      }, 100)

      previousUrl.current = currentUrl
      return () => clearTimeout(timer)
    }

    previousUrl.current = currentUrl
  }, [pathname, searchParams, detectRouteChanges])

  /**
   * Start navigation loading - will auto-close when route changes
   */
  const startNavigationLoading = useCallback((msg?: string) => {
    isNavigating.current = true
    
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }

    loadingStartTime.current = Date.now()
    setIsLoading(true)
    if (msg) setMessage(msg)
  }, [])

  /**
   * Show the global loader
   */
  const showLoader = useCallback((msg?: string) => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }

    activeRequests.current += 1
    loadingStartTime.current = Date.now()
    setIsLoading(true)
    if (msg) setMessage(msg)
  }, [])

  /**
   * Hide the global loader (respecting minDisplayTime)
   */
  const hideLoader = useCallback(() => {
    activeRequests.current = Math.max(0, activeRequests.current - 1)

    // Only hide if no more active requests
    if (activeRequests.current > 0) return

    const elapsed = loadingStartTime.current
      ? Date.now() - loadingStartTime.current
      : minDisplayTime

    const remainingTime = Math.max(0, minDisplayTime - elapsed)

    // Clear any existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }

    if (remainingTime > 0) {
      // Wait for minimum display time
      hideTimeoutRef.current = setTimeout(() => {
        setIsLoading(false)
        setMessage(null)
        setProgress(null)
        loadingStartTime.current = null
      }, remainingTime)
    } else {
      // Hide immediately
      setIsLoading(false)
      setMessage(null)
      setProgress(null)
      loadingStartTime.current = null
    }
  }, [minDisplayTime])

  /**
   * Track an async operation
   */
  const trackPromise = useCallback(
    async <T,>(promise: Promise<T>, msg?: string): Promise<T> => {
      showLoader(msg)
      try {
        const result = await promise
        return result
      } finally {
        hideLoader()
      }
    },
    [showLoader, hideLoader]
  )

  const value: LoadingContextType = {
    isLoading,
    message,
    progress,
    startLoading: showLoader,
    stopLoading: hideLoader,
    setMessage,
    setProgress,
    trackPromise,
    startNavigationLoading,
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <GlobalLoader
        isVisible={isLoading}
        message={message || undefined}
        progress={progress ?? undefined}
        {...loaderProps}
      />
    </LoadingContext.Provider>
  )
}

/**
 * Hook to access loading context
 */
export function useGlobalLoading(): LoadingContextType {
  const context = useContext(LoadingContext)

  if (!context) {
    throw new Error('useGlobalLoading must be used within a LoadingProvider')
  }

  return context
}

/**
 * Hook to get just the loading state
 */
export function useIsLoading(): boolean {
  return useGlobalLoading().isLoading
}

/**
 * Hook for convenient async tracking
 */
export function useAsyncLoader() {
  const { trackPromise, startLoading, stopLoading, setMessage, setProgress } =
    useGlobalLoading()

  return {
    track: trackPromise,
    start: startLoading,
    stop: stopLoading,
    setMessage,
    setProgress,
  }
}
