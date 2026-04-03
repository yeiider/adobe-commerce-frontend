'use client'

/**
 * Providers Component
 * 
 * Client-side wrapper that combines all global providers.
 * This component should wrap the entire application in the root layout.
 */

import { type ReactNode, Suspense } from 'react'
import { LoadingProvider, type LoadingProviderProps } from './LoadingProvider'

export interface ProvidersProps {
  children: ReactNode
  /** Configuration for the global loader */
  loaderConfig?: LoadingProviderProps['loaderProps']
}

/**
 * Global Providers Wrapper
 * 
 * Wraps application with all necessary client-side providers.
 * The LoadingProvider handles route change detection via useSearchParams,
 * which requires Suspense boundary.
 */
export function Providers({ children, loaderConfig }: ProvidersProps) {
  return (
    <Suspense fallback={null}>
      <LoadingProvider
        loaderProps={{
          variant: 'branded',
          blur: 'sm',
          backdropOpacity: 'medium',
          showProgressBar: true,
          ...loaderConfig,
        }}
        detectRouteChanges={true}
        minDisplayTime={300}
      >
        {children}
      </LoadingProvider>
    </Suspense>
  )
}

export default Providers
