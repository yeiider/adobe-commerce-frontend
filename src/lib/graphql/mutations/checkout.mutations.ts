/**
 * Checkout GraphQL Mutations
 * All checkout-related mutations for Adobe Commerce
 */

import { ORDER_FRAGMENT } from '../fragments/checkout.fragments'
import { CART_SHIPPING_ADDRESS_FRAGMENT, CART_BILLING_ADDRESS_FRAGMENT } from '../fragments/cart.fragments'

export const SET_SHIPPING_ADDRESSES_ON_CART = /* GraphQL */ `
  mutation SetShippingAddressesOnCart($cartId: String!, $shippingAddresses: [ShippingAddressInput!]!) {
    setShippingAddressesOnCart(input: { cart_id: $cartId, shipping_addresses: $shippingAddresses }) {
      cart {
        shipping_addresses {
          ...CartShippingAddress
        }
      }
    }
  }
  ${CART_SHIPPING_ADDRESS_FRAGMENT}
`

export const SET_BILLING_ADDRESS_ON_CART = /* GraphQL */ `
  mutation SetBillingAddressOnCart($cartId: String!, $billingAddress: BillingAddressInput!) {
    setBillingAddressOnCart(input: { cart_id: $cartId, billing_address: $billingAddress }) {
      cart {
        billing_address {
          ...CartBillingAddress
        }
      }
    }
  }
  ${CART_BILLING_ADDRESS_FRAGMENT}
`

export const SET_SHIPPING_METHODS_ON_CART = /* GraphQL */ `
  mutation SetShippingMethodsOnCart($cartId: String!, $shippingMethods: [ShippingMethodInput!]!) {
    setShippingMethodsOnCart(input: { cart_id: $cartId, shipping_methods: $shippingMethods }) {
      cart {
        shipping_addresses {
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
  }
`

export const SET_PAYMENT_METHOD_ON_CART = /* GraphQL */ `
  mutation SetPaymentMethodOnCart($cartId: String!, $paymentMethod: PaymentMethodInput!) {
    setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: $paymentMethod }) {
      cart {
        selected_payment_method {
          code
          title
        }
      }
    }
  }
`

export const PLACE_ORDER = /* GraphQL */ `
  mutation PlaceOrder($cartId: String!) {
    placeOrder(input: { cart_id: $cartId }) {
      order {
        ...Order
      }
      errors {
        code
        message
      }
    }
  }
  ${ORDER_FRAGMENT}
`
