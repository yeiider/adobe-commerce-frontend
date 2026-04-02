/**
 * Customer GraphQL Fragments
 * Reusable fragments for customer-related queries
 */

export const CUSTOMER_ADDRESS_FRAGMENT = /* GraphQL */ `
  fragment CustomerAddress on CustomerAddress {
    id
    firstname
    lastname
    company
    street
    city
    region {
      region_id
      region_code
      region
    }
    postcode
    country_code
    telephone
    default_shipping
    default_billing
  }
`

export const CUSTOMER_BASIC_FRAGMENT = /* GraphQL */ `
  fragment CustomerBasic on Customer {
    id
    firstname
    lastname
    email
    is_subscribed
    created_at
    date_of_birth
    gender
    taxvat
    prefix
    suffix
    middlename
  }
`

export const CUSTOMER_FRAGMENT = /* GraphQL */ `
  fragment Customer on Customer {
    ...CustomerBasic
    addresses {
      ...CustomerAddress
    }
    default_shipping
    default_billing
  }
`

export const CUSTOMER_ORDER_ITEM_FRAGMENT = /* GraphQL */ `
  fragment CustomerOrderItem on OrderItemInterface {
    id
    product_name
    product_sku
    product_url_key
    product_sale_price {
      value
      currency
    }
    quantity_ordered
    quantity_shipped
    quantity_canceled
    quantity_invoiced
    quantity_refunded
    status
    discounts {
      amount {
        value
        currency
      }
      label
    }
  }
`

export const CUSTOMER_ORDER_FRAGMENT = /* GraphQL */ `
  fragment CustomerOrder on CustomerOrder {
    id
    number
    order_date
    status
    shipping_method
    payment_methods {
      name
      type
    }
    total {
      grand_total {
        value
        currency
      }
      subtotal {
        value
        currency
      }
      total_shipping {
        value
        currency
      }
      total_tax {
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
    billing_address {
      firstname
      lastname
      street
      city
      region
      postcode
      country_code
      telephone
    }
    shipping_address {
      firstname
      lastname
      street
      city
      region
      postcode
      country_code
      telephone
    }
    items {
      ...CustomerOrderItem
    }
  }
`

export const WISHLIST_ITEM_FRAGMENT = /* GraphQL */ `
  fragment WishlistItem on WishlistItemInterface {
    id
    quantity
    description
    added_at
    product {
      uid
      sku
      name
      url_key
      thumbnail {
        url
        label
      }
      price_range {
        minimum_price {
          regular_price {
            value
            currency
          }
          final_price {
            value
            currency
          }
        }
      }
      stock_status
    }
  }
`

export const WISHLIST_FRAGMENT = /* GraphQL */ `
  fragment Wishlist on Wishlist {
    id
    name
    items_count
    sharing_code
    updated_at
    items_v2 {
      items {
        ...WishlistItem
      }
      page_info {
        current_page
        page_size
        total_pages
      }
    }
  }
`
