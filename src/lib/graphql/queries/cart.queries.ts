/**
 * Cart GraphQL Queries
 * All cart-related queries for Adobe Commerce
 */

import {
  CART_FRAGMENT,
  CART_ITEM_FRAGMENT,
  CART_PRICES_FRAGMENT,
  CART_SHIPPING_ADDRESS_FRAGMENT,
  CART_BILLING_ADDRESS_FRAGMENT,
} from '../fragments/cart.fragments'

export const GET_CART = /* GraphQL */ `
  query GetCart($cartId: String!) {
    cart(cart_id: $cartId) {
      ...Cart
    }
  }
  ${CART_ITEM_FRAGMENT}
  ${CART_PRICES_FRAGMENT}
  ${CART_SHIPPING_ADDRESS_FRAGMENT}
  ${CART_BILLING_ADDRESS_FRAGMENT}
  ${CART_FRAGMENT}
`

export const GET_CART_ITEMS = /* GraphQL */ `
  query GetCartItems($cartId: String!) {
    cart(cart_id: $cartId) {
      id
      total_quantity
      items {
        ...CartItem
      }
    }
  }
  ${CART_ITEM_FRAGMENT}
`

export const GET_CART_TOTALS = /* GraphQL */ `
  query GetCartTotals($cartId: String!) {
    cart(cart_id: $cartId) {
      id
      total_quantity
      prices {
        ...CartPrices
      }
    }
  }
  ${CART_PRICES_FRAGMENT}
`

export const GET_CART_SHIPPING_METHODS = /* GraphQL */ `
  query GetCartShippingMethods($cartId: String!) {
    cart(cart_id: $cartId) {
      id
      shipping_addresses {
        available_shipping_methods {
          carrier_code
          carrier_title
          method_code
          method_title
          amount {
            value
            currency
          }
          available
          error_message
        }
        selected_shipping_method {
          carrier_code
          carrier_title
          method_code
          method_title
          amount {
            value
            currency
          }
        }
      }
    }
  }
`

export const GET_CART_PAYMENT_METHODS = /* GraphQL */ `
  query GetCartPaymentMethods($cartId: String!) {
    cart(cart_id: $cartId) {
      id
      available_payment_methods {
        code
        title
      }
      selected_payment_method {
        code
        title
      }
    }
  }
`
