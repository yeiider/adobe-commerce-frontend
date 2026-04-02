/**
 * Search Service
 * Business logic for search operations
 */

import { graphqlClient } from '@/src/lib/graphql/client'
import { SEARCH_PRODUCTS, GET_SEARCH_SUGGESTIONS } from '@/src/lib/graphql/queries/search.queries'
import { ProductsResponse, SearchSuggestion, Product } from '@/src/types/product.types'
import { config } from '@/src/config/env'

export interface SearchOptions {
  search: string
  pageSize?: number
  currentPage?: number
  sort?: Record<string, 'ASC' | 'DESC'>
  filter?: Record<string, unknown>
}

export interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[]
  products: Pick<Product, 'uid' | 'name' | 'url_key' | 'thumbnail'>[]
}

/**
 * Search products
 */
export async function searchProducts(options: SearchOptions): Promise<ProductsResponse | null> {
  const { search, pageSize = 20, currentPage = 1, sort, filter } = options

  const { data, errors } = await graphqlClient<{ products: ProductsResponse }>({
    query: SEARCH_PRODUCTS,
    variables: { search, pageSize, currentPage, sort, filter },
    revalidate: config.cache.staleWhileRevalidate,
  })

  if (errors || !data?.products) {
    return null
  }

  return data.products
}

/**
 * Get search suggestions
 */
export async function getSearchSuggestions(search: string): Promise<SearchSuggestionsResponse | null> {
  const { data, errors } = await graphqlClient<{
    products: {
      suggestions: SearchSuggestion[]
      items: Pick<Product, 'uid' | 'name' | 'url_key' | 'thumbnail'>[]
    }
  }>({
    query: GET_SEARCH_SUGGESTIONS,
    variables: { search },
    cache: 'no-store',
  })

  if (errors || !data?.products) {
    return null
  }

  return {
    suggestions: data.products.suggestions || [],
    products: data.products.items || [],
  }
}
