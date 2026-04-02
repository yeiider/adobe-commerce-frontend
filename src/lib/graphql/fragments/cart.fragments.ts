/**
 * Cart GraphQL Fragments
 * Reusable fragments for cart-related queries
 */

export const CART_ITEM_FRAGMENT = /* GraphQL */ `
  fragment CartItem on CartItemInterface {
    uid
    quantity
    prices {
      price {
        value
        currency
      }
      row_total {
        value
        currency
      }
      row_total_including_tax {
        value
        currency
      }
      discounts {
        amount {
          value
          currency
        }
        label
      }
    }
    product {
      uid
      sku
      name
      url_key
      thumbnail {
        url
        label
      }
      stock_status
    }
    ... on ConfigurableCartItem {
      configurable_options {
        id
        option_label
        value_id
        value_label
      }
    }
    ... on BundleCartItem {
      bundle_options {
        uid
        label
        type
        values {
          id
          label
          price
          quantity
        }
      }
    }
  }
`

export const CART_PRICES_FRAGMENT = /* GraphQL */ `
  fragment CartPrices on CartPrices {
    grand_total {
      value
      currency
    }
    subtotal_excluding_tax {
      value
      currency
    }
    subtotal_including_tax {
      value
      currency
    }
    subtotal_with_discount_excluding_tax {
      value
      currency
    }
    applied_taxes {
      amount {
        value
        currency
      }
      label
    }
    discounts {
      amount {
        value
        currency
      }
      label
    }
  }
`

export const CART_SHIPPING_ADDRESS_FRAGMENT = /* GraphQL */ `
  fragment CartShippingAddress on ShippingCartAddress {
    firstname
    lastname
    company
    street
    city
    region {
      code
      label
      region_id
    }
    postcode
    country {
      code
      label
    }
    telephone
    available_shipping_methods {
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
`

export const CART_BILLING_ADDRESS_FRAGMENT = /* GraphQL */ `
  fragment CartBillingAddress on BillingCartAddress {
    firstname
    lastname
    company
    street
    city
    region {
      code
      label
      region_id
    }
    postcode
    country {
      code
      label
    }
    telephone
  }
`

export const CART_FRAGMENT = /* GraphQL */ `
  fragment Cart on Cart {
    id
    email
    is_virtual
    total_quantity
    items {
      ...CartItem
    }
    prices {
      ...CartPrices
    }
    shipping_addresses {
      ...CartShippingAddress
    }
    billing_address {
      ...CartBillingAddress
    }
    available_payment_methods {
      code
      title
    }
    selected_payment_method {
      code
      title
    }
    applied_coupons {
      code
    }
  }
`
