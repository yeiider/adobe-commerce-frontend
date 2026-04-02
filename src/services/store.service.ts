/**
 * Store Service
 * Business logic for store configuration operations
 */

import { graphqlClient } from '@/lib/graphql/client'
import {
  GET_STORE_CONFIG,
  GET_AVAILABLE_STORES,
  GET_CURRENCY,
} from '@/lib/graphql/queries/store.queries'
import {
  StoreConfig,
  AvailableStore,
  Currency,
  StoreConfigResponse,
  AvailableStoresResponse,
  CurrencyResponse,
} from '@/types/store.types'
import { config } from '@/config/env'

/**
 * Get store configuration
 */
export async function getStoreConfig(): Promise<StoreConfig | null> {
  const { data, errors } = await graphqlClient<StoreConfigResponse>({
    query: GET_STORE_CONFIG,
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.storeConfig) {
    return null
  }

  return data.storeConfig
}

/**
 * Get available stores
 */
export async function getAvailableStores(): Promise<AvailableStore[] | null> {
  const { data, errors } = await graphqlClient<AvailableStoresResponse>({
    query: GET_AVAILABLE_STORES,
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.availableStores) {
    return null
  }

  return data.availableStores
}

/**
 * Get currency information
 */
export async function getCurrency(): Promise<Currency | null> {
  const { data, errors } = await graphqlClient<CurrencyResponse>({
    query: GET_CURRENCY,
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.currency) {
    return null
  }

  return data.currency
}
