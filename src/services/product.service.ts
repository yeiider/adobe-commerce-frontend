/**
 * Product Service
 * Business logic for product operations
 */

import { graphqlClient } from '@/src/lib/graphql/client'
import {
  GET_PRODUCT_BY_URL_KEY,
  GET_PRODUCT_BY_SKU,
  GET_PRODUCTS_BY_CATEGORY,
  GET_PRODUCTS_BY_FILTER,
  GET_PRODUCT_REVIEWS,
} from '@/src/lib/graphql/queries/product.queries'
import { Product, ProductsResponse, ProductReviews } from '@/src/types/product.types'
import { config } from '@/src/config/env'

export interface GetProductsOptions {
  categoryUid?: string
  filter?: Record<string, unknown>
  pageSize?: number
  currentPage?: number
  sort?: Record<string, 'ASC' | 'DESC'>
}

export interface GetProductReviewsOptions {
  sku: string
  pageSize?: number
  currentPage?: number
}

/**
 * Get a single product by URL key
 */
export async function getProductByUrlKey(urlKey: string): Promise<Product | null> {
  const { data, errors } = await graphqlClient<{ products: { items: Product[] } }>({
    query: GET_PRODUCT_BY_URL_KEY,
    variables: { urlKey },
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.products?.items?.length) {
    return null
  }

  return data.products.items[0]
}

/**
 * Get a single product by SKU
 */
export async function getProductBySku(sku: string): Promise<Product | null> {
  const { data, errors } = await graphqlClient<{ products: { items: Product[] } }>({
    query: GET_PRODUCT_BY_SKU,
    variables: { sku },
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.products?.items?.length) {
    return null
  }

  return data.products.items[0]
}

/**
 * Get products by category UID
 */
export async function getProductsByCategory(options: GetProductsOptions): Promise<ProductsResponse | null> {
  const { categoryUid, pageSize = 20, currentPage = 1, sort } = options

  const { data, errors } = await graphqlClient<{ products: ProductsResponse }>({
    query: GET_PRODUCTS_BY_CATEGORY,
    variables: { categoryUid, pageSize, currentPage, sort },
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.products) {
    return null
  }

  return data.products
}

/**
 * Get products by filter
 */
export async function getProductsByFilter(options: GetProductsOptions): Promise<ProductsResponse | null> {
  const { filter, pageSize = 20, currentPage = 1, sort } = options

  const { data, errors } = await graphqlClient<{ products: ProductsResponse }>({
    query: GET_PRODUCTS_BY_FILTER,
    variables: { filter, pageSize, currentPage, sort },
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.products) {
    return null
  }

  return data.products
}

/**
 * Get product reviews
 */
export async function getProductReviews(options: GetProductReviewsOptions): Promise<ProductReviews | null> {
  const { sku, pageSize = 10, currentPage = 1 } = options

  const { data, errors } = await graphqlClient<{ products: { items: Array<{ reviews: ProductReviews }> } }>({
    query: GET_PRODUCT_REVIEWS,
    variables: { sku, pageSize, currentPage },
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.products?.items?.length) {
    return null
  }

  return data.products.items[0].reviews
}
