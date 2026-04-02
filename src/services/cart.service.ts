/**
 * Cart Service
 * Business logic for cart operations
 */

import { graphqlClient } from '@/src/lib/graphql/client'
import {
  GET_CART,
  GET_CART_ITEMS,
  GET_CART_TOTALS,
  GET_CART_SHIPPING_METHODS,
  GET_CART_PAYMENT_METHODS,
} from '@/src/lib/graphql/queries/cart.queries'
import {
  CREATE_EMPTY_CART,
  ADD_PRODUCTS_TO_CART,
  UPDATE_CART_ITEMS,
  REMOVE_ITEM_FROM_CART,
  APPLY_COUPON_TO_CART,
  REMOVE_COUPON_FROM_CART,
  MERGE_CARTS,
  SET_GUEST_EMAIL_ON_CART,
} from '@/src/lib/graphql/mutations/cart.mutations'
import {
  Cart,
  CartItem,
  CartItemInput,
  CartItemUpdateInput,
  AddToCartResponse,
  UpdateCartResponse,
  RemoveFromCartResponse,
} from '@/src/types/cart.types'
import { config } from '@/src/config/env'

/**
 * Create an empty cart
 */
export async function createEmptyCart(): Promise<string | null> {
  const { data, errors } = await graphqlClient<{ createEmptyCart: string }>({
    query: CREATE_EMPTY_CART,
    cache: 'no-store',
  })

  if (errors || !data?.createEmptyCart) {
    return null
  }

  return data.createEmptyCart
}

/**
 * Get cart by ID
 */
export async function getCart(cartId: string): Promise<Cart | null> {
  const { data, errors } = await graphqlClient<{ cart: Cart }>({
    query: GET_CART,
    variables: { cartId },
    cache: 'no-store',
  })

  if (errors || !data?.cart) {
    return null
  }

  return data.cart
}

/**
 * Get cart items only
 */
export async function getCartItems(cartId: string): Promise<CartItem[] | null> {
  const { data, errors } = await graphqlClient<{ cart: { items: CartItem[] } }>({
    query: GET_CART_ITEMS,
    variables: { cartId },
    cache: 'no-store',
  })

  if (errors || !data?.cart?.items) {
    return null
  }

  return data.cart.items
}

/**
 * Add products to cart
 */
export async function addProductsToCart(
  cartId: string,
  cartItems: CartItemInput[]
): Promise<AddToCartResponse['addProductsToCart'] | null> {
  const { data, errors } = await graphqlClient<AddToCartResponse>({
    query: ADD_PRODUCTS_TO_CART,
    variables: { cartId, cartItems },
    cache: 'no-store',
  })

  if (errors || !data?.addProductsToCart) {
    return null
  }

  return data.addProductsToCart
}

/**
 * Update cart items
 */
export async function updateCartItems(
  cartId: string,
  cartItems: CartItemUpdateInput[]
): Promise<Cart | null> {
  const { data, errors } = await graphqlClient<UpdateCartResponse>({
    query: UPDATE_CART_ITEMS,
    variables: { cartId, cartItems },
    cache: 'no-store',
  })

  if (errors || !data?.updateCartItems?.cart) {
    return null
  }

  return data.updateCartItems.cart
}

/**
 * Remove item from cart
 */
export async function removeItemFromCart(cartId: string, cartItemUid: string): Promise<Cart | null> {
  const { data, errors } = await graphqlClient<RemoveFromCartResponse>({
    query: REMOVE_ITEM_FROM_CART,
    variables: { cartId, cartItemUid },
    cache: 'no-store',
  })

  if (errors || !data?.removeItemFromCart?.cart) {
    return null
  }

  return data.removeItemFromCart.cart
}

/**
 * Apply coupon to cart
 */
export async function applyCouponToCart(cartId: string, couponCode: string): Promise<boolean> {
  const { data, errors } = await graphqlClient<{
    applyCouponToCart: { cart: { applied_coupons: Array<{ code: string }> } }
  }>({
    query: APPLY_COUPON_TO_CART,
    variables: { cartId, couponCode },
    cache: 'no-store',
  })

  return !errors && !!data?.applyCouponToCart?.cart?.applied_coupons?.length
}

/**
 * Remove coupon from cart
 */
export async function removeCouponFromCart(cartId: string): Promise<boolean> {
  const { data, errors } = await graphqlClient<{
    removeCouponFromCart: { cart: { applied_coupons: Array<{ code: string }> | null } }
  }>({
    query: REMOVE_COUPON_FROM_CART,
    variables: { cartId },
    cache: 'no-store',
  })

  return !errors && !data?.removeCouponFromCart?.cart?.applied_coupons?.length
}

/**
 * Merge guest cart with customer cart
 */
export async function mergeCarts(sourceCartId: string, destinationCartId: string): Promise<string | null> {
  const { data, errors } = await graphqlClient<{ mergeCarts: { id: string } }>({
    query: MERGE_CARTS,
    variables: { sourceCartId, destinationCartId },
    cache: 'no-store',
  })

  if (errors || !data?.mergeCarts?.id) {
    return null
  }

  return data.mergeCarts.id
}

/**
 * Set guest email on cart
 */
export async function setGuestEmailOnCart(cartId: string, email: string): Promise<boolean> {
  const { data, errors } = await graphqlClient<{
    setGuestEmailOnCart: { cart: { email: string } }
  }>({
    query: SET_GUEST_EMAIL_ON_CART,
    variables: { cartId, email },
    cache: 'no-store',
  })

  return !errors && !!data?.setGuestEmailOnCart?.cart?.email
}

/**
 * Get or create cart ID (client-side helper)
 */
export function getStoredCartId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(config.auth.cartIdKey)
}

/**
 * Store cart ID (client-side helper)
 */
export function storeCartId(cartId: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(config.auth.cartIdKey, cartId)
}

/**
 * Clear stored cart ID (client-side helper)
 */
export function clearStoredCartId(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(config.auth.cartIdKey)
}
