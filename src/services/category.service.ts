/**
 * Category Service
 * Business logic for category operations
 */

import { graphqlClient } from '@/lib/graphql/client'
import {
  GET_CATEGORY_TREE,
  GET_CATEGORY_BY_URL_KEY,
  GET_CATEGORY_BY_URL_PATH,
  GET_CATEGORY_BY_ID,
  GET_CATEGORY_WITH_PRODUCTS,
  GET_NAVIGATION_MENU,
} from '@/lib/graphql/queries/category.queries'
import { Category, NavigationItem, CategoryTreeResponse } from '@/types/category.types'
import { ProductsResponse } from '@/types/product.types'
import { config } from '@/config/env'

export interface GetCategoryWithProductsOptions {
  urlPath: string
  pageSize?: number
  currentPage?: number
  sort?: Record<string, 'ASC' | 'DESC'>
}

export interface CategoryWithProducts extends Category {
  products: ProductsResponse
}

/**
 * Get the full category tree
 */
export async function getCategoryTree(parentId: number = 2): Promise<Category[] | null> {
  const { data, errors } = await graphqlClient<CategoryTreeResponse>({
    query: GET_CATEGORY_TREE,
    variables: { parentId },
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.categories?.items) {
    return null
  }

  return data.categories.items
}

/**
 * Get category by URL key
 */
export async function getCategoryByUrlKey(urlKey: string): Promise<Category | null> {
  const { data, errors } = await graphqlClient<CategoryTreeResponse>({
    query: GET_CATEGORY_BY_URL_KEY,
    variables: { urlKey },
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.categories?.items?.length) {
    return null
  }

  return data.categories.items[0]
}

/**
 * Get category by URL path
 */
export async function getCategoryByUrlPath(urlPath: string): Promise<Category | null> {
  const { data, errors } = await graphqlClient<CategoryTreeResponse>({
    query: GET_CATEGORY_BY_URL_PATH,
    variables: { urlPath },
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.categories?.items?.length) {
    return null
  }

  return data.categories.items[0]
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: number): Promise<Category | null> {
  const { data, errors } = await graphqlClient<CategoryTreeResponse>({
    query: GET_CATEGORY_BY_ID,
    variables: { id },
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.categories?.items?.length) {
    return null
  }

  return data.categories.items[0]
}

/**
 * Get category with products
 */
export async function getCategoryWithProducts(
  options: GetCategoryWithProductsOptions
): Promise<CategoryWithProducts | null> {
  const { urlPath, pageSize = 20, currentPage = 1, sort } = options

  const { data, errors } = await graphqlClient<{
    categories: { items: CategoryWithProducts[] }
  }>({
    query: GET_CATEGORY_WITH_PRODUCTS,
    variables: { urlPath, pageSize, currentPage, sort },
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.categories?.items?.length) {
    return null
  }

  return data.categories.items[0]
}

/**
 * Get navigation menu
 */
export async function getNavigationMenu(): Promise<NavigationItem[] | null> {
  const { data, errors } = await graphqlClient<{
    categories: { items: NavigationItem[] }
  }>({
    query: GET_NAVIGATION_MENU,
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.categories?.items) {
    return null
  }

  // Filter only items that should be in menu
  return data.categories.items.filter((item) => item.include_in_menu)
}
