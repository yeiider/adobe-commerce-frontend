/**
 * Product GraphQL Queries
 * All product-related queries for Adobe Commerce
 */

import {
  PRODUCT_BASIC_FRAGMENT,
  PRODUCT_PRICE_FRAGMENT,
  PRODUCT_IMAGE_FRAGMENT,
  PRODUCT_SEO_FRAGMENT,
  PRODUCT_DETAILS_FRAGMENT,
  CONFIGURABLE_PRODUCT_FRAGMENT,
  BUNDLE_PRODUCT_FRAGMENT,
  GROUPED_PRODUCT_FRAGMENT,
} from '../fragments/product.fragments'

export const GET_PRODUCT_BY_URL_KEY = /* GraphQL */ `
  query GetProductByUrlKey($urlKey: String!) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
        ...ProductDetails
        ... on ConfigurableProduct {
          ...ConfigurableProduct
        }
        ... on BundleProduct {
          ...BundleProduct
        }
        ... on GroupedProduct {
          ...GroupedProduct
        }
      }
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
  ${PRODUCT_PRICE_FRAGMENT}
  ${PRODUCT_IMAGE_FRAGMENT}
  ${PRODUCT_SEO_FRAGMENT}
  ${PRODUCT_DETAILS_FRAGMENT}
  ${CONFIGURABLE_PRODUCT_FRAGMENT}
  ${BUNDLE_PRODUCT_FRAGMENT}
  ${GROUPED_PRODUCT_FRAGMENT}
`

export const GET_PRODUCT_BY_SKU = /* GraphQL */ `
  query GetProductBySku($sku: String!) {
    products(filter: { sku: { eq: $sku } }) {
      items {
        ...ProductDetails
        ... on ConfigurableProduct {
          ...ConfigurableProduct
        }
        ... on BundleProduct {
          ...BundleProduct
        }
        ... on GroupedProduct {
          ...GroupedProduct
        }
      }
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
  ${PRODUCT_PRICE_FRAGMENT}
  ${PRODUCT_IMAGE_FRAGMENT}
  ${PRODUCT_SEO_FRAGMENT}
  ${PRODUCT_DETAILS_FRAGMENT}
  ${CONFIGURABLE_PRODUCT_FRAGMENT}
  ${BUNDLE_PRODUCT_FRAGMENT}
  ${GROUPED_PRODUCT_FRAGMENT}
`

export const GET_PRODUCTS_BY_CATEGORY = /* GraphQL */ `
  query GetProductsByCategory(
    $categoryUid: String!
    $pageSize: Int = 20
    $currentPage: Int = 1
    $sort: ProductAttributeSortInput
  ) {
    products(
      filter: { category_uid: { eq: $categoryUid } }
      pageSize: $pageSize
      currentPage: $currentPage
      sort: $sort
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
      sort_fields {
        default
        options {
          label
          value
        }
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

export const GET_PRODUCTS_BY_FILTER = /* GraphQL */ `
  query GetProductsByFilter(
    $filter: ProductAttributeFilterInput!
    $pageSize: Int = 20
    $currentPage: Int = 1
    $sort: ProductAttributeSortInput
  ) {
    products(
      filter: $filter
      pageSize: $pageSize
      currentPage: $currentPage
      sort: $sort
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

export const GET_PRODUCT_REVIEWS = /* GraphQL */ `
  query GetProductReviews(
    $sku: String!
    $pageSize: Int = 10
    $currentPage: Int = 1
  ) {
    products(filter: { sku: { eq: $sku } }) {
      items {
        sku
        review_count
        rating_summary
        reviews(pageSize: $pageSize, currentPage: $currentPage) {
          items {
            summary
            text
            nickname
            created_at
            average_rating
            ratings_breakdown {
              name
              value
            }
          }
          page_info {
            current_page
            page_size
            total_pages
          }
        }
      }
    }
  }
`
