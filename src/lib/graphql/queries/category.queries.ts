/**
 * Category GraphQL Queries
 * All category-related queries for Adobe Commerce
 */

import {
  CATEGORY_BASIC_FRAGMENT,
  CATEGORY_SEO_FRAGMENT,
  CATEGORY_IMAGE_FRAGMENT,
  CATEGORY_BREADCRUMB_FRAGMENT,
  CATEGORY_TREE_FRAGMENT,
  CATEGORY_DETAILS_FRAGMENT,
} from '../fragments/category.fragments'

export const GET_CATEGORY_TREE = /* GraphQL */ `
  query GetCategoryTree($parentId: Int = 2) {
    categories(filters: { parent_id: { eq: $parentId } }) {
      items {
        ...CategoryTree
      }
    }
  }
  ${CATEGORY_BASIC_FRAGMENT}
  ${CATEGORY_IMAGE_FRAGMENT}
  ${CATEGORY_TREE_FRAGMENT}
`

export const GET_CATEGORY_BY_URL_KEY = /* GraphQL */ `
  query GetCategoryByUrlKey($urlKey: String!) {
    categories(filters: { url_key: { eq: $urlKey } }) {
      items {
        ...CategoryDetails
      }
    }
  }
  ${CATEGORY_BASIC_FRAGMENT}
  ${CATEGORY_SEO_FRAGMENT}
  ${CATEGORY_IMAGE_FRAGMENT}
  ${CATEGORY_BREADCRUMB_FRAGMENT}
  ${CATEGORY_DETAILS_FRAGMENT}
`

export const GET_CATEGORY_BY_URL_PATH = /* GraphQL */ `
  query GetCategoryByUrlPath($urlPath: String!) {
    categories(filters: { url_path: { eq: $urlPath } }) {
      items {
        ...CategoryDetails
      }
    }
  }
  ${CATEGORY_BASIC_FRAGMENT}
  ${CATEGORY_SEO_FRAGMENT}
  ${CATEGORY_IMAGE_FRAGMENT}
  ${CATEGORY_BREADCRUMB_FRAGMENT}
  ${CATEGORY_DETAILS_FRAGMENT}
`

export const GET_CATEGORY_BY_ID = /* GraphQL */ `
  query GetCategoryById($id: Int!) {
    categories(filters: { ids: { eq: $id } }) {
      items {
        ...CategoryDetails
      }
    }
  }
  ${CATEGORY_BASIC_FRAGMENT}
  ${CATEGORY_SEO_FRAGMENT}
  ${CATEGORY_IMAGE_FRAGMENT}
  ${CATEGORY_BREADCRUMB_FRAGMENT}
  ${CATEGORY_DETAILS_FRAGMENT}
`

export const GET_CATEGORY_WITH_PRODUCTS = /* GraphQL */ `
  query GetCategoryWithProducts(
    $urlPath: String!
    $pageSize: Int = 20
    $currentPage: Int = 1
    $sort: ProductAttributeSortInput
  ) {
    categories(filters: { url_path: { eq: $urlPath } }) {
      items {
        ...CategoryDetails
        products(pageSize: $pageSize, currentPage: $currentPage, sort: $sort) {
          total_count
          page_info {
            current_page
            page_size
            total_pages
          }
          items {
            uid
            sku
            name
            url_key
            url_suffix
            stock_status
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
                discount {
                  amount_off
                  percent_off
                }
              }
            }
          }
        }
      }
    }
  }
  ${CATEGORY_BASIC_FRAGMENT}
  ${CATEGORY_SEO_FRAGMENT}
  ${CATEGORY_IMAGE_FRAGMENT}
  ${CATEGORY_BREADCRUMB_FRAGMENT}
  ${CATEGORY_DETAILS_FRAGMENT}
`

export const GET_NAVIGATION_MENU = /* GraphQL */ `
  query GetNavigationMenu {
    categories(filters: { parent_id: { eq: "2" } }) {
      items {
        id
        uid
        name
        url_key
        url_path
        position
        include_in_menu
        children_count
        children {
          id
          uid
          name
          url_key
          url_path
          position
          include_in_menu
          children_count
          children {
            id
            uid
            name
            url_key
            url_path
            position
            include_in_menu
          }
        }
      }
    }
  }
`
