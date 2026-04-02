/**
 * Cart Hook
 * Custom hook for cart management with SWR
 */

'use client'

import useSWR from 'swr'
import {
  getCart,
  createEmptyCart,
  addProductsToCart,
  updateCartItems,
  removeItemFromCart,
  applyCouponToCart,
  removeCouponFromCart,
  getStoredCartId,
  storeCartId,
  clearStoredCartId,
} from '@/src/services/cart.service'
import { Cart, CartItemInput, CartItemUpdateInput } from '@/src/types/cart.types'
import { useCallback, useEffect, useState } from 'react'

const CART_KEY = 'adobe-commerce-cart'

export function useCart() {
  const [cartId, setCartId] = useState<string | null>(null)

  // Initialize cart ID from storage
  useEffect(() => {
    const storedCartId = getStoredCartId()
    if (storedCartId) {
      setCartId(storedCartId)
    }
  }, [])

  // Fetch cart data
  const {
    data: cart,
    error,
    isLoading,
    mutate,
  } = useSWR<Cart | null>(
    cartId ? [CART_KEY, cartId] : null,
    ([, id]) => getCart(id),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  // Create a new cart
  const createCart = useCallback(async () => {
    const newCartId = await createEmptyCart()
    if (newCartId) {
      storeCartId(newCartId)
      setCartId(newCartId)
    }
    return newCartId
  }, [])

  // Ensure cart exists
  const ensureCart = useCallback(async () => {
    if (cartId) return cartId
    return createCart()
  }, [cartId, createCart])

  // Add items to cart
  const addItems = useCallback(
    async (items: CartItemInput[]) => {
      const currentCartId = await ensureCart()
      if (!currentCartId) return null

      const result = await addProductsToCart(currentCartId, items)
      if (result?.cart) {
        mutate(result.cart, false)
      }
      return result
    },
    [ensureCart, mutate]
  )

  // Update cart items
  const updateItems = useCallback(
    async (items: CartItemUpdateInput[]) => {
      if (!cartId) return null

      const result = await updateCartItems(cartId, items)
      if (result) {
        mutate(result, false)
      }
      return result
    },
    [cartId, mutate]
  )

  // Remove item from cart
  const removeItem = useCallback(
    async (cartItemUid: string) => {
      if (!cartId) return null

      const result = await removeItemFromCart(cartId, cartItemUid)
      if (result) {
        mutate(result, false)
      }
      return result
    },
    [cartId, mutate]
  )

  // Apply coupon
  const applyCoupon = useCallback(
    async (couponCode: string) => {
      if (!cartId) return false

      const success = await applyCouponToCart(cartId, couponCode)
      if (success) {
        mutate()
      }
      return success
    },
    [cartId, mutate]
  )

  // Remove coupon
  const removeCoupon = useCallback(async () => {
    if (!cartId) return false

    const success = await removeCouponFromCart(cartId)
    if (success) {
      mutate()
    }
    return success
  }, [cartId, mutate])

  // Clear cart
  const clearCart = useCallback(() => {
    clearStoredCartId()
    setCartId(null)
    mutate(null, false)
  }, [mutate])

  return {
    cart,
    cartId,
    isLoading,
    error,
    itemCount: cart?.total_quantity ?? 0,
    addItems,
    updateItems,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearCart,
    refresh: mutate,
  }
}
