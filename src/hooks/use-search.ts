/**
 * Search Hook
 * Custom hook for search functionality with debouncing
 */

'use client'

import useSWR from 'swr'
import { useState, useCallback, useMemo } from 'react'
import { searchProducts, getSearchSuggestions, SearchOptions } from '@/src/services/search.service'
import { ProductsResponse, Product, SearchSuggestion } from '@/src/types/product.types'
import { useDebouncedValue } from './use-debounced-value'

const SEARCH_KEY = 'adobe-commerce-search'
const SUGGESTIONS_KEY = 'adobe-commerce-suggestions'

export interface UseSearchOptions {
  debounceMs?: number
  minChars?: number
  pageSize?: number
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 300, minChars = 3, pageSize = 20 } = options

  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState<Record<string, 'ASC' | 'DESC'> | undefined>()
  const [filters, setFilters] = useState<Record<string, unknown> | undefined>()

  // Debounced query for API calls
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  const shouldSearch = debouncedQuery.length >= minChars

  // Search results
  const {
    data: results,
    error,
    isLoading,
    mutate,
  } = useSWR<ProductsResponse | null>(
    shouldSearch ? [SEARCH_KEY, debouncedQuery, currentPage, sort, filters] : null,
    () =>
      searchProducts({
        search: debouncedQuery,
        pageSize,
        currentPage,
        sort,
        filter: filters,
      }),
    {
      revalidateOnFocus: false,
    }
  )

  // Search suggestions
  const {
    data: suggestionsData,
    isLoading: suggestionsLoading,
  } = useSWR<{ suggestions: SearchSuggestion[]; products: Pick<Product, 'uid' | 'name' | 'url_key' | 'thumbnail'>[] } | null>(
    shouldSearch ? [SUGGESTIONS_KEY, debouncedQuery] : null,
    () => getSearchSuggestions(debouncedQuery),
    {
      revalidateOnFocus: false,
    }
  )

  // Update query
  const search = useCallback((newQuery: string) => {
    setQuery(newQuery)
    setCurrentPage(1)
  }, [])

  // Clear search
  const clear = useCallback(() => {
    setQuery('')
    setCurrentPage(1)
    setSort(undefined)
    setFilters(undefined)
  }, [])

  // Pagination
  const goToPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  // Update sort
  const updateSort = useCallback((newSort: Record<string, 'ASC' | 'DESC'>) => {
    setSort(newSort)
    setCurrentPage(1)
  }, [])

  // Update filters
  const updateFilters = useCallback((newFilters: Record<string, unknown>) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  // Computed values
  const hasResults = useMemo(
    () => (results?.items?.length ?? 0) > 0,
    [results]
  )

  const totalPages = results?.page_info?.total_pages ?? 0

  return {
    // State
    query,
    results,
    suggestions: suggestionsData?.suggestions ?? [],
    suggestedProducts: suggestionsData?.products ?? [],
    
    // Loading states
    isLoading,
    suggestionsLoading,
    error,
    
    // Computed
    hasResults,
    totalResults: results?.total_count ?? 0,
    currentPage,
    totalPages,
    aggregations: results?.aggregations ?? [],
    
    // Actions
    search,
    clear,
    goToPage,
    updateSort,
    updateFilters,
    refresh: mutate,
  }
}

// Re-export the debounce hook for external use
export { useDebouncedValue } from './use-debounced-value'
