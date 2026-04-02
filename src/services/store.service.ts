/**
 * Store Service
 * Business logic for store configuration operations
 */

import { graphqlClient } from '@/src/lib/graphql/client'
import {
  GET_STORE_CONFIG,
  GET_AVAILABLE_STORES,
  GET_CURRENCY_CONFIG,
} from '@/src/lib/graphql/queries/store.queries'
import {
  StoreConfig,
  AvailableStore,
  Currency,
  StoreConfigResponse,
  AvailableStoresResponse,
  CurrencyResponse,
} from '@/src/types/store.types'

/**
 * Cache time for store configuration (in seconds)
 * Store config rarely changes, so we use a long cache time
 */
const STORE_CONFIG_CACHE_TIME = 3600 // 1 hour

/**
 * Get core store configuration
 * Uses aggressive caching since store config rarely changes
 */
export async function getStoreConfig(): Promise<StoreConfig | null> {
  try {
    const { data, errors } = await graphqlClient<StoreConfigResponse>({
      query: GET_STORE_CONFIG,
      revalidate: STORE_CONFIG_CACHE_TIME,
      tags: ['store-config'],
    })

    if (errors) {
      console.error('[StoreService] Error fetching store config:', errors)
      return null
    }

    return data?.storeConfig ?? null
  } catch (error) {
    console.error('[StoreService] Failed to fetch store config:', error)
    return null
  }
}

/**
 * Get currency configuration
 * Includes exchange rates for multi-currency support
 */
export async function getCurrencyConfig(): Promise<Currency | null> {
  try {
    const { data, errors } = await graphqlClient<CurrencyResponse>({
      query: GET_CURRENCY_CONFIG,
      revalidate: STORE_CONFIG_CACHE_TIME,
      tags: ['currency-config'],
    })

    if (errors) {
      console.error('[StoreService] Error fetching currency config:', errors)
      return null
    }

    return data?.currency ?? null
  } catch (error) {
    console.error('[StoreService] Failed to fetch currency config:', error)
    return null
  }
}

// Alias for backward compatibility
export const getCurrency = getCurrencyConfig

/**
 * Get available stores for multi-store support
 */
export async function getAvailableStores(): Promise<AvailableStore[] | null> {
  try {
    const { data, errors } = await graphqlClient<AvailableStoresResponse>({
      query: GET_AVAILABLE_STORES,
      revalidate: STORE_CONFIG_CACHE_TIME,
      tags: ['available-stores'],
    })

    if (errors) {
      console.error('[StoreService] Error fetching available stores:', errors)
      return null
    }

    return data?.availableStores ?? null
  } catch (error) {
    console.error('[StoreService] Failed to fetch available stores:', error)
    return null
  }
}

/**
 * Combined Store Context
 * All store configuration data needed for the storefront
 */
export interface StoreContext {
  storeConfig: StoreConfig | null
  currency: Currency | null
}

/**
 * Get all store context data in parallel
 * Optimized for initial page load
 */
export async function getStoreContext(): Promise<StoreContext> {
  const [storeConfig, currency] = await Promise.all([
    getStoreConfig(),
    getCurrencyConfig(),
  ])

  return {
    storeConfig,
    currency,
  }
}
