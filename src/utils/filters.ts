/**
 * Filter Utilities
 * Helper functions for managing product filters and URL state
 */

import type { FilterState, ProductAttributeFilterInput } from '@/src/types/common.types'

/**
 * Parse URL search params into filter state
 * 
 * @param searchParams - URLSearchParams or Record of search params
 * @param excludeParams - Params to exclude (e.g., 'page', 'sort')
 * @returns Filter state object
 */
export function parseFiltersFromUrl(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  excludeParams: string[] = ['page', 'sort']
): FilterState {
  const filters: FilterState = {}
  
  const entries = searchParams instanceof URLSearchParams
    ? Array.from(searchParams.entries())
    : Object.entries(searchParams).flatMap(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(v => [key, v] as [string, string])
        }
        return value ? [[key, value] as [string, string]] : []
      })

  entries.forEach(([key, value]) => {
    if (excludeParams.includes(key) || !value) return
    
    const existing = filters[key]
    if (existing) {
      if (Array.isArray(existing)) {
        existing.push(value)
      } else {
        filters[key] = [existing, value]
      }
    } else {
      filters[key] = value
    }
  })

  return filters
}

/**
 * Attributes that use range filters (from/to) instead of eq/in
 */
const RANGE_FILTER_ATTRIBUTES = ['price']

/**
 * Parse a range value like "30_40" into {from, to}
 * Supports formats: "30_40", "30_*", "*_40"
 */
function parseRangeValue(value: string): { from?: string; to?: string } | null {
  const parts = value.split('_')
  if (parts.length !== 2) return null
  
  const [from, to] = parts
  const result: { from?: string; to?: string } = {}
  
  if (from && from !== '*') {
    result.from = from
  }
  if (to && to !== '*') {
    result.to = to
  }
  
  return Object.keys(result).length > 0 ? result : null
}

/**
 * Convert filter state to GraphQL filter input
 * 
 * @param filterState - Current filter state
 * @param categoryId - Optional category ID to include (numeric ID as string, e.g., "21")
 * @returns GraphQL filter input object
 */
export function buildGraphQLFilter(
  filterState: FilterState,
  categoryId?: string | number
): ProductAttributeFilterInput {
  const filter: ProductAttributeFilterInput = {}

  // Add category filter if provided (uses category_id with numeric ID)
  if (categoryId) {
    filter.category_id = { eq: String(categoryId) }
  }

  // Convert filter state to GraphQL format
  Object.entries(filterState).forEach(([attributeCode, values]) => {
    if (!values || (Array.isArray(values) && values.length === 0)) return

    // Handle range filters (like price)
    if (RANGE_FILTER_ATTRIBUTES.includes(attributeCode)) {
      const value = Array.isArray(values) ? values[0] : values
      const rangeValue = parseRangeValue(value)
      if (rangeValue) {
        filter[attributeCode] = rangeValue
      }
      return
    }

    if (Array.isArray(values)) {
      // Multiple values: use "in" operator
      filter[attributeCode] = { in: values }
    } else {
      // Single value: use "eq" operator
      filter[attributeCode] = { eq: values }
    }
  })

  return filter
}

/**
 * Parse sort parameter from URL to GraphQL sort input
 * 
 * @param sortParam - Sort parameter from URL (e.g., "price_ASC")
 * @returns GraphQL sort input or undefined
 */
export function parseSortParam(
  sortParam?: string | null
): Record<string, 'ASC' | 'DESC'> | undefined {
  if (!sortParam || sortParam === 'relevance') return undefined

  const [field, direction] = sortParam.split('_')
  if (field && (direction === 'ASC' || direction === 'DESC')) {
    return { [field]: direction }
  }

  return undefined
}

/**
 * Build URL with updated filters
 * 
 * @param basePath - Base path (e.g., '/category/men')
 * @param filters - Current filter state
 * @param options - Additional options like sort and page
 * @returns Complete URL string
 */
export function buildFilterUrl(
  basePath: string,
  filters: FilterState,
  options: { sort?: string; page?: number } = {}
): string {
  const params = new URLSearchParams()

  // Add filters
  Object.entries(filters).forEach(([key, values]) => {
    if (Array.isArray(values)) {
      values.forEach(v => params.append(key, v))
    } else if (values) {
      params.set(key, values)
    }
  })

  // Add sort
  if (options.sort && options.sort !== 'relevance') {
    params.set('sort', options.sort)
  }

  // Add page
  if (options.page && options.page > 1) {
    params.set('page', options.page.toString())
  }

  const queryString = params.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}

/**
 * Get count of active filters (excluding category)
 * 
 * @param filterState - Current filter state
 * @returns Number of active filters
 */
export function getActiveFilterCount(filterState: FilterState): number {
  return Object.values(filterState).reduce((count, values) => {
    if (Array.isArray(values)) {
      return count + values.length
    }
    return count + (values ? 1 : 0)
  }, 0)
}
