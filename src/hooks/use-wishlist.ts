/**
 * Wishlist Hook
 * Custom hook for wishlist management with SWR
 */

'use client'

import useSWR from 'swr'
import { useCallback } from 'react'
import { graphqlClient } from '@/src/lib/graphql/client'
import { getCustomerWishlists } from '@/src/services/customer.service'
import {
  ADD_PRODUCTS_TO_WISHLIST,
  REMOVE_PRODUCTS_FROM_WISHLIST,
} from '@/src/lib/graphql/mutations/wishlist.mutations'
import { Wishlist } from '@/src/types/customer.types'
import { useCustomer } from './use-customer'

const WISHLIST_KEY = 'adobe-commerce-wishlist'

export function useWishlist() {
  const { isAuthenticated } = useCustomer()

  // Fetch wishlists
  const {
    data: wishlists,
    error,
    isLoading,
    mutate,
  } = useSWR<Wishlist[] | null>(
    isAuthenticated ? WISHLIST_KEY : null,
    () => getCustomerWishlists(),
    {
      revalidateOnFocus: false,
    }
  )

  // Get default wishlist
  const defaultWishlist = wishlists?.[0] ?? null

  // Add product to wishlist
  const addProduct = useCallback(
    async (sku: string, quantity: number = 1) => {
      if (!defaultWishlist) return null

      const { data, errors } = await graphqlClient<{
        addProductsToWishlist: { wishlist: Wishlist }
      }>({
        query: ADD_PRODUCTS_TO_WISHLIST,
        variables: {
          wishlistId: defaultWishlist.id,
          wishlistItems: [{ sku, quantity }],
        },
        cache: 'no-store',
      })

      if (!errors && data?.addProductsToWishlist?.wishlist) {
        mutate()
        return data.addProductsToWishlist.wishlist
      }

      return null
    },
    [defaultWishlist, mutate]
  )

  // Remove product from wishlist
  const removeProduct = useCallback(
    async (wishlistItemId: string) => {
      if (!defaultWishlist) return false

      const { data, errors } = await graphqlClient<{
        removeProductsFromWishlist: { wishlist: Wishlist }
      }>({
        query: REMOVE_PRODUCTS_FROM_WISHLIST,
        variables: {
          wishlistId: defaultWishlist.id,
          wishlistItemsIds: [wishlistItemId],
        },
        cache: 'no-store',
      })

      if (!errors && data?.removeProductsFromWishlist?.wishlist) {
        mutate()
        return true
      }

      return false
    },
    [defaultWishlist, mutate]
  )

  // Check if product is in wishlist
  const isInWishlist = useCallback(
    (sku: string) => {
      if (!defaultWishlist) return false
      return defaultWishlist.items_v2.items.some(
        (item) => item.product.sku === sku
      )
    },
    [defaultWishlist]
  )

  return {
    wishlists,
    defaultWishlist,
    itemCount: defaultWishlist?.items_count ?? 0,
    isLoading,
    error,
    addProduct,
    removeProduct,
    isInWishlist,
    refresh: mutate,
  }
}
