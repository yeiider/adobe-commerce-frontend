/**
 * Store Config Hook
 * Custom hook for store configuration with SWR
 */

'use client'

import useSWR from 'swr'
import {
  getStoreConfig,
  getAvailableStores,
  getCurrency,
} from '@/src/services/store.service'
import { StoreConfig, AvailableStore, Currency } from '@/src/types/store.types'

const STORE_CONFIG_KEY = 'adobe-commerce-store-config'
const AVAILABLE_STORES_KEY = 'adobe-commerce-available-stores'
const CURRENCY_KEY = 'adobe-commerce-currency'

export function useStoreConfig() {
  const {
    data: storeConfig,
    error,
    isLoading,
  } = useSWR<StoreConfig | null>(
    STORE_CONFIG_KEY,
    () => getStoreConfig(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    }
  )

  return {
    storeConfig,
    isLoading,
    error,
  }
}

export function useAvailableStores() {
  const {
    data: stores,
    error,
    isLoading,
  } = useSWR<AvailableStore[] | null>(
    AVAILABLE_STORES_KEY,
    () => getAvailableStores(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  )

  return {
    stores,
    isLoading,
    error,
  }
}

export function useCurrency() {
  const {
    data: currency,
    error,
    isLoading,
  } = useSWR<Currency | null>(
    CURRENCY_KEY,
    () => getCurrency(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  )

  return {
    currency,
    isLoading,
    error,
  }
}
