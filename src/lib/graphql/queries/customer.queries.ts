/**
 * Customer GraphQL Queries
 * All customer-related queries for Adobe Commerce
 */

import {
  CUSTOMER_FRAGMENT,
  CUSTOMER_BASIC_FRAGMENT,
  CUSTOMER_ADDRESS_FRAGMENT,
  CUSTOMER_ORDER_FRAGMENT,
  CUSTOMER_ORDER_ITEM_FRAGMENT,
  WISHLIST_FRAGMENT,
  WISHLIST_ITEM_FRAGMENT,
} from '../fragments/customer.fragments'

export const GET_CUSTOMER = /* GraphQL */ `
  query GetCustomer {
    customer {
      ...Customer
    }
  }
  ${CUSTOMER_BASIC_FRAGMENT}
  ${CUSTOMER_ADDRESS_FRAGMENT}
  ${CUSTOMER_FRAGMENT}
`

export const GET_CUSTOMER_ADDRESSES = /* GraphQL */ `
  query GetCustomerAddresses {
    customer {
      addresses {
        ...CustomerAddress
      }
      default_shipping
      default_billing
    }
  }
  ${CUSTOMER_ADDRESS_FRAGMENT}
`

export const GET_CUSTOMER_ORDERS = /* GraphQL */ `
  query GetCustomerOrders(
    $filter: CustomerOrdersFilterInput
    $pageSize: Int = 10
    $currentPage: Int = 1
  ) {
    customer {
      orders(filter: $filter, pageSize: $pageSize, currentPage: $currentPage) {
        total_count
        page_info {
          current_page
          page_size
          total_pages
        }
        items {
          ...CustomerOrder
        }
      }
    }
  }
  ${CUSTOMER_ORDER_ITEM_FRAGMENT}
  ${CUSTOMER_ORDER_FRAGMENT}
`

export const GET_CUSTOMER_ORDER = /* GraphQL */ `
  query GetCustomerOrder($orderNumber: String!) {
    customer {
      orders(filter: { number: { eq: $orderNumber } }) {
        items {
          ...CustomerOrder
        }
      }
    }
  }
  ${CUSTOMER_ORDER_ITEM_FRAGMENT}
  ${CUSTOMER_ORDER_FRAGMENT}
`

export const GET_CUSTOMER_WISHLISTS = /* GraphQL */ `
  query GetCustomerWishlists {
    customer {
      wishlists {
        ...Wishlist
      }
    }
  }
  ${WISHLIST_ITEM_FRAGMENT}
  ${WISHLIST_FRAGMENT}
`

export const GET_MY_WISHLIST = /* GraphQL */ `
  query GetMyWishlist {
    customer {
      wishlist {
        id
        items_count
        sharing_code
        items_v2(currentPage: 1, pageSize: 20) {
          page_info {
            current_page
            total_pages
            page_size
          }
          items {
            id
            quantity
            description
            added_at
            product {
              __typename
              sku
              name
              url_key
              stock_status
              thumbnail {
                url
                label
              }
              price_range {
                minimum_price {
                  final_price {
                    value
                    currency
                  }
                }
              }
              ... on ConfigurableProduct {
                configurable_options {
                  attribute_id
                  attribute_code
                  label
                  values {
                    value_index
                    label
                    swatch_data {
                      value
                    }
                  }
                }
                variants {
                  attributes {
                    code
                    value_index
                  }
                  product {
                    sku
                    stock_status
                    thumbnail {
                      url
                    }
                    price_range {
                      maximum_price {
                        final_price {
                          value
                          currency
                        }
                      }
                    }
                  }
                }
              }
            }
            ... on ConfigurableWishlistItem {
              configurable_options {
                option_label
                value_label
              }
            }
          }
        }
      }
    }
  }
`

export const IS_EMAIL_AVAILABLE = /* GraphQL */ `
  query IsEmailAvailable($email: String!) {
    isEmailAvailable(email: $email) {
      is_email_available
    }
  }
`
