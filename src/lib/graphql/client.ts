/**
 * GraphQL Client for Adobe Commerce
 * Handles all GraphQL requests with proper headers and error handling
 */

import { config } from '@/config/env'

export interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: string[]
    extensions?: Record<string, unknown>
  }>
}

export interface GraphQLRequestOptions {
  query: string
  variables?: Record<string, unknown>
  headers?: Record<string, string>
  cache?: RequestCache
  revalidate?: number
}

/**
 * Creates the base headers for Adobe Commerce GraphQL requests
 */
function createHeaders(customHeaders?: Record<string, string>): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Store': config.adobe.storeViewCode,
  }

  // Add customer token if available (client-side)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(config.auth.customerTokenKey)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return { ...headers, ...customHeaders }
}

/**
 * Execute a GraphQL query against Adobe Commerce
 */
export async function graphqlClient<T>(
  options: GraphQLRequestOptions
): Promise<GraphQLResponse<T>> {
  const { query, variables, headers: customHeaders, cache, revalidate } = options

  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: createHeaders(customHeaders),
    body: JSON.stringify({ query, variables }),
  }

  // Handle Next.js caching
  if (cache) {
    fetchOptions.cache = cache
  }

  if (revalidate !== undefined) {
    fetchOptions.next = { revalidate }
  }

  try {
    const response = await fetch(config.adobe.graphqlEndpoint, fetchOptions)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()
    return json as GraphQLResponse<T>
  } catch (error) {
    console.error('[GraphQL Client Error]:', error)
    throw error
  }
}

/**
 * Server-side GraphQL client with admin token
 */
export async function graphqlServerClient<T>(
  options: GraphQLRequestOptions & { adminToken?: string }
): Promise<GraphQLResponse<T>> {
  const { adminToken, ...rest } = options

  return graphqlClient<T>({
    ...rest,
    headers: {
      ...rest.headers,
      ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
    },
  })
}
