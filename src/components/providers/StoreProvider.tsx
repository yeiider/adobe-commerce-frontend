'use client'

/**
 * Store Provider
 * Provides store configuration context to all components
 */

import { createContext, useContext, type ReactNode } from 'react'
import type { StoreConfig, Currency } from '@/src/types/store.types'

/**
 * Store Context Type
 */
export interface StoreContextType {
  storeConfig: StoreConfig | null
  currency: Currency | null
  rootCategoryId: string
  // Derived helpers
  formatPrice: (price: number, currencyCode?: string) => string
  getMediaUrl: (path: string) => string
  getCategoryUrl: (urlPath: string) => string
  getProductUrl: (urlKey: string) => string
}

/**
 * Default context value
 */
const defaultContext: StoreContextType = {
  storeConfig: null,
  currency: null,
  rootCategoryId: '2',
  formatPrice: (price: number) => `$${price.toFixed(2)}`,
  getMediaUrl: (path: string) => path,
  getCategoryUrl: (urlPath: string) => `/${urlPath}`,
  getProductUrl: (urlKey: string) => `/${urlKey}`,
}

const StoreContext = createContext<StoreContextType>(defaultContext)

/**
 * Store Provider Props
 */
interface StoreProviderProps {
  children: ReactNode
  storeConfig: StoreConfig | null
  currency: Currency | null
  rootCategoryId?: string
}

/**
 * Store Provider Component
 * Wraps the application with store context
 */
export function StoreProvider({ children, storeConfig, currency, rootCategoryId }: StoreProviderProps) {
  // Derive rootCategoryId from storeConfig if not provided
  const effectiveRootCategoryId = rootCategoryId || storeConfig?.root_category_id?.toString() || '2'
  /**
   * Format price with currency symbol
   */
  const formatPrice = (price: number, currencyCode?: string): string => {
    const code = currencyCode || currency?.default_display_currency_code || 'USD'
    const symbol = currency?.default_display_currency_symbol || '$'
    
    // If using a different currency, check for exchange rate
    if (currencyCode && currency?.exchange_rates) {
      const exchangeRate = currency.exchange_rates.find(
        (rate) => rate.currency_to === currencyCode
      )
      if (exchangeRate) {
        price = price * exchangeRate.rate
      }
    }

    // Use Intl.NumberFormat for proper formatting
    try {
      return new Intl.NumberFormat(storeConfig?.locale || 'en-US', {
        style: 'currency',
        currency: code,
      }).format(price)
    } catch {
      // Fallback if currency code is invalid
      return `${symbol}${price.toFixed(2)}`
    }
  }

  /**
   * Get full media URL
   */
  const getMediaUrl = (path: string): string => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    
    const baseUrl = storeConfig?.secure_base_media_url || ''
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
  }

  /**
   * Get category URL with suffix
   */
  const getCategoryUrl = (urlPath: string): string => {
    if (!urlPath) return '/'
    const suffix = storeConfig?.category_url_suffix || ''
    return `/${urlPath}${suffix}`
  }

  /**
   * Get product URL with suffix
   */
  const getProductUrl = (urlKey: string): string => {
    if (!urlKey) return '/'
    const suffix = storeConfig?.product_url_suffix || ''
    return `/${urlKey}${suffix}`
  }

  const value: StoreContextType = {
    storeConfig,
    currency,
    rootCategoryId: effectiveRootCategoryId,
    formatPrice,
    getMediaUrl,
    getCategoryUrl,
    getProductUrl,
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}

/**
 * Hook to access store context
 */
export function useStore(): StoreContextType {
  const context = useContext(StoreContext)
  
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  
  return context
}

/**
 * Hook to access store config only
 */
export function useStoreConfig(): StoreConfig | null {
  return useStore().storeConfig
}

/**
 * Hook to access currency only
 */
export function useCurrency(): Currency | null {
  return useStore().currency
}

/**
 * Hook for price formatting
 */
export function usePriceFormatter(): (price: number, currencyCode?: string) => string {
  return useStore().formatPrice
}

/**
 * Hook to get root category ID
 */
export function useRootCategoryId(): string {
  return useStore().rootCategoryId
}
