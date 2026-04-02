/**
 * Cart GraphQL Mutations
 * All cart-related mutations for Adobe Commerce
 */

import {
  CART_FRAGMENT,
  CART_ITEM_FRAGMENT,
  CART_PRICES_FRAGMENT,
  CART_SHIPPING_ADDRESS_FRAGMENT,
  CART_BILLING_ADDRESS_FRAGMENT,
} from '../fragments/cart.fragments'

export const CREATE_EMPTY_CART = /* GraphQL */ `
  mutation CreateEmptyCart {
    createEmptyCart
  }
`

export const CREATE_GUEST_CART = /* GraphQL */ `
  mutation CreateGuestCart {
    createGuestCart {
      cart {
        id
      }
    }
  }
`

export const ADD_PRODUCTS_TO_CART = /* GraphQL */ `
  mutation AddProductsToCart($cartId: String!, $cartItems: [CartItemInput!]!) {
    addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
      cart {
        ...Cart
      }
      user_errors {
        code
        message
      }
    }
  }
  ${CART_ITEM_FRAGMENT}
  ${CART_PRICES_FRAGMENT}
  ${CART_SHIPPING_ADDRESS_FRAGMENT}
  ${CART_BILLING_ADDRESS_FRAGMENT}
  ${CART_FRAGMENT}
`

export const UPDATE_CART_ITEMS = /* GraphQL */ `
  mutation UpdateCartItems($cartId: String!, $cartItems: [CartItemUpdateInput!]!) {
    updateCartItems(input: { cart_id: $cartId, cart_items: $cartItems }) {
      cart {
        ...Cart
      }
    }
  }
  ${CART_ITEM_FRAGMENT}
  ${CART_PRICES_FRAGMENT}
  ${CART_SHIPPING_ADDRESS_FRAGMENT}
  ${CART_BILLING_ADDRESS_FRAGMENT}
  ${CART_FRAGMENT}
`

export const REMOVE_ITEM_FROM_CART = /* GraphQL */ `
  mutation RemoveItemFromCart($cartId: String!, $cartItemUid: ID!) {
    removeItemFromCart(input: { cart_id: $cartId, cart_item_uid: $cartItemUid }) {
      cart {
        ...Cart
      }
    }
  }
  ${CART_ITEM_FRAGMENT}
  ${CART_PRICES_FRAGMENT}
  ${CART_SHIPPING_ADDRESS_FRAGMENT}
  ${CART_BILLING_ADDRESS_FRAGMENT}
  ${CART_FRAGMENT}
`

export const APPLY_COUPON_TO_CART = /* GraphQL */ `
  mutation ApplyCouponToCart($cartId: String!, $couponCode: String!) {
    applyCouponToCart(input: { cart_id: $cartId, coupon_code: $couponCode }) {
      cart {
        id
        applied_coupons {
          code
        }
        prices {
          ...CartPrices
        }
      }
    }
  }
  ${CART_PRICES_FRAGMENT}
`

export const REMOVE_COUPON_FROM_CART = /* GraphQL */ `
  mutation RemoveCouponFromCart($cartId: String!) {
    removeCouponFromCart(input: { cart_id: $cartId }) {
      cart {
        id
        applied_coupons {
          code
        }
        prices {
          ...CartPrices
        }
      }
    }
  }
  ${CART_PRICES_FRAGMENT}
`

export const MERGE_CARTS = /* GraphQL */ `
  mutation MergeCarts($sourceCartId: String!, $destinationCartId: String!) {
    mergeCarts(source_cart_id: $sourceCartId, destination_cart_id: $destinationCartId) {
      id
      total_quantity
    }
  }
`

export const SET_GUEST_EMAIL_ON_CART = /* GraphQL */ `
  mutation SetGuestEmailOnCart($cartId: String!, $email: String!) {
    setGuestEmailOnCart(input: { cart_id: $cartId, email: $email }) {
      cart {
        email
      }
    }
  }
`
