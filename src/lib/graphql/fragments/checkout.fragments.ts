/**
 * Checkout GraphQL Fragments
 * Reusable fragments for checkout-related queries
 */

export const COUNTRY_FRAGMENT = /* GraphQL */ `
  fragment Country on Country {
    id
    two_letter_abbreviation
    three_letter_abbreviation
    full_name_locale
    full_name_english
    available_regions {
      id
      code
      name
    }
  }
`

export const ORDER_FRAGMENT = /* GraphQL */ `
  fragment Order on Order {
    order_number
    order_id
  }
`

export const PAYMENT_METHOD_FRAGMENT = /* GraphQL */ `
  fragment PaymentMethod on AvailablePaymentMethod {
    code
    title
  }
`

export const SHIPPING_METHOD_FRAGMENT = /* GraphQL */ `
  fragment ShippingMethod on AvailableShippingMethod {
    carrier_code
    carrier_title
    method_code
    method_title
    amount {
      value
      currency
    }
    price_excl_tax {
      value
      currency
    }
    price_incl_tax {
      value
      currency
    }
    available
    error_message
  }
`
