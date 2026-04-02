/**
 * Category Service
 * Business logic for category operations
 */

import { graphqlClient } from '@/src/lib/graphql/client'
import {
  GET_CATEGORY_TREE,
  GET_CATEGORY_BY_URL_KEY,
  GET_CATEGORY_BY_URL_PATH,
  GET_CATEGORY_BY_ID,
  GET_CATEGORY_WITH_PRODUCTS,
  GET_NAVIGATION_MENU,
} from '@/src/lib/graphql/queries/category.queries'
import { Category, NavigationItem, CategoryTreeResponse, CategoryListResponse } from '@/src/types/category.types'
import { ProductsResponse } from '@/src/types/product.types'

/**
 * Default cache time for category data (5 minutes)
 */
const DEFAULT_CACHE_TIME = 300

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
    revalidate: DEFAULT_CACHE_TIME,
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
    revalidate: DEFAULT_CACHE_TIME,
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
    revalidate: DEFAULT_CACHE_TIME,
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
    revalidate: DEFAULT_CACHE_TIME,
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
    revalidate: DEFAULT_CACHE_TIME,
  })

  if (errors || !data?.categories?.items?.length) {
    return null
  }

  return data.categories.items[0]
}

/**
 * Navigation menu cache time (in seconds)
 * Navigation rarely changes, so we use a longer cache time
 */
const NAVIGATION_CACHE_TIME = 3600 // 1 hour

/**
 * Get navigation menu using Magento's categoryList query
 * Uses aggressive caching since navigation structure rarely changes
 * 
 * @param categoryId - The root category ID (default: "2" for Default Category)
 * @returns Array of navigation items (main categories with their children)
 */
export async function getNavigationMenu(categoryId: string = "2"): Promise<NavigationItem[] | null> {
  try {
    const { data, errors } = await graphqlClient<CategoryListResponse>({
      query: GET_NAVIGATION_MENU,
      variables: { categoryId },
      revalidate: NAVIGATION_CACHE_TIME,
      tags: ['navigation', 'categories'],
    })

    if (errors) {
      console.error('[CategoryService] Navigation menu errors:', errors)
      return null
    }
    
    // categoryList returns an array with the root category
    if (!data?.categoryList?.length) {
      console.error('[CategoryService] No categories found in response')
      return null
    }

    // The root category (Default Category) contains the children we need for navigation
    const rootCategory = data.categoryList[0]
    
    if (!rootCategory?.children) {
      return []
    }

    // Return the children of the root category (these are the main nav items)
    return rootCategory.children
  } catch (error) {
    console.error('[CategoryService] Error fetching navigation menu:', error)
    return null
  }
}
