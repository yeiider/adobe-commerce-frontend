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

export const IS_EMAIL_AVAILABLE = /* GraphQL */ `
  query IsEmailAvailable($email: String!) {
    isEmailAvailable(email: $email) {
      is_email_available
    }
  }
`
