/**
 * Search GraphQL Queries
 * All search-related queries for Adobe Commerce
 */

import {
  PRODUCT_BASIC_FRAGMENT,
  PRODUCT_PRICE_FRAGMENT,
  PRODUCT_IMAGE_FRAGMENT,
} from '../fragments/product.fragments'

export const SEARCH_PRODUCTS = /* GraphQL */ `
  query SearchProducts(
    $search: String!
    $pageSize: Int = 20
    $currentPage: Int = 1
    $sort: ProductAttributeSortInput
    $filter: ProductAttributeFilterInput
  ) {
    products(
      search: $search
      pageSize: $pageSize
      currentPage: $currentPage
      sort: $sort
      filter: $filter
    ) {
      total_count
      page_info {
        current_page
        page_size
        total_pages
      }
      aggregations {
        attribute_code
        count
        label
        options {
          count
          label
          value
        }
      }
      suggestions {
        search
      }
      items {
        ...ProductBasic
        ...ProductPrice
        ...ProductImage
      }
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
  ${PRODUCT_PRICE_FRAGMENT}
  ${PRODUCT_IMAGE_FRAGMENT}
`

export const GET_SEARCH_SUGGESTIONS = /* GraphQL */ `
  query GetSearchSuggestions($search: String!) {
    products(search: $search, pageSize: 5) {
      suggestions {
        search
      }
      items {
        uid
        name
        url_key
        thumbnail {
          url
          label
        }
      }
    }
  }
`
