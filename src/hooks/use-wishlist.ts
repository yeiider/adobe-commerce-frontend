/**
 * Wishlist Hook
 * Manages the customer's default wishlist using the singular customer.wishlist query.
 */

'use client'

import useSWR from 'swr'
import { useCallback } from 'react'
import { graphqlClient } from '@/src/lib/graphql/client'
import { GET_MY_WISHLIST } from '@/src/lib/graphql/queries/customer.queries'
import {
  ADD_PRODUCTS_TO_WISHLIST,
  REMOVE_PRODUCTS_FROM_WISHLIST,
} from '@/src/lib/graphql/mutations/wishlist.mutations'
import { Wishlist } from '@/src/types/customer.types'
import { useCustomer } from './use-customer'

const WISHLIST_KEY = 'adobe-commerce-wishlist'

async function fetchMyWishlist(): Promise<Wishlist | null> {
  const { data, errors } = await graphqlClient<{ customer: { wishlist: Wishlist } }>({
    query: GET_MY_WISHLIST,
    cache: 'no-store',
  })

  if (errors || !data?.customer?.wishlist) {
    return null
  }

  return data.customer.wishlist
}

export function useWishlist() {
  const { isAuthenticated } = useCustomer()

  const {
    data: wishlist,
    error,
    isLoading,
    mutate,
  } = useSWR<Wishlist | null>(
    isAuthenticated ? WISHLIST_KEY : null,
    fetchMyWishlist,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  // Check if a SKU is already in the wishlist
  const isInWishlist = useCallback(
    (sku: string) => {
      if (!wishlist) return false
      return wishlist.items_v2.items.some((item) => item.product.sku === sku)
    },
    [wishlist]
  )

  // Get the wishlist item ID for a given SKU (needed to remove it)
  const getWishlistItemId = useCallback(
    (sku: string): string | undefined => {
      return wishlist?.items_v2.items.find((item) => item.product.sku === sku)?.id
    },
    [wishlist]
  )

  // Add product to the default wishlist
  const addProduct = useCallback(
    async (sku: string, quantity: number = 1) => {
      if (!wishlist) return null

      const { data, errors } = await graphqlClient<{
        addProductsToWishlist: {
          wishlist: Wishlist
          user_errors: { code: string; message: string }[]
        }
      }>({
        query: ADD_PRODUCTS_TO_WISHLIST,
        variables: {
          wishlistId: wishlist.id,
          wishlistItems: [{ sku, quantity }],
        },
        cache: 'no-store',
      })

      if (errors) {
        console.error('[addProduct] GraphQL errors:', errors)
        return null
      }

      const userErrors = data?.addProductsToWishlist?.user_errors
      if (userErrors?.length) {
        console.error('[addProduct] User errors:', userErrors)
        return null
      }

      const updated = data?.addProductsToWishlist?.wishlist
      if (updated) {
        mutate(updated, false)
        return updated
      }

      return null
    },
    [wishlist, mutate]
  )

  // Remove a product from the wishlist by its wishlist item ID
  const removeProduct = useCallback(
    async (wishlistItemId: string) => {
      if (!wishlist) return false

      const { data, errors } = await graphqlClient<{
        removeProductsFromWishlist: {
          wishlist: Wishlist
          user_errors: { code: string; message: string }[]
        }
      }>({
        query: REMOVE_PRODUCTS_FROM_WISHLIST,
        variables: {
          wishlistId: wishlist.id,
          wishlistItemsIds: [wishlistItemId],
        },
        cache: 'no-store',
      })

      if (errors) {
        console.error('[removeProduct] GraphQL errors:', errors)
        return false
      }

      const userErrors = data?.removeProductsFromWishlist?.user_errors
      if (userErrors?.length) {
        console.error('[removeProduct] User errors:', userErrors)
        return false
      }

      const updated = data?.removeProductsFromWishlist?.wishlist
      if (updated) {
        mutate(updated, false)
        return true
      }

      return false
    },
    [wishlist, mutate]
  )

  return {
    wishlist,
    // Keep wishlists array for backward compat with any existing consumer
    wishlists: wishlist ? [wishlist] : null,
    defaultWishlist: wishlist,
    itemCount: wishlist?.items_count ?? 0,
    isLoading,
    error,
    isInWishlist,
    getWishlistItemId,
    addProduct,
    removeProduct,
    refresh: mutate,
  }
}
