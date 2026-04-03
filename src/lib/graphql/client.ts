/**
 * GraphQL Client for Adobe Commerce
 * Handles all GraphQL requests with proper headers and error handling
 */

import { config } from '@/src/config/env'

// Lazy import to avoid issues in client components
async function getServerCookieToken(): Promise<string | null> {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    return cookieStore.get(config.auth.customerTokenKey)?.value ?? null
  } catch {
    return null
  }
}

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
  tags?: string[]
}

/**
 * Creates the base headers for Adobe Commerce GraphQL requests
 * 
 * Magento uses these headers to determine:
 * - Store: Which store view to use (determines language, catalog, prices)
 * - Content-Currency: Which currency to display prices in
 */
function createHeaders(customHeaders?: Record<string, string>): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    // Store view code - determines catalog, CMS content, and language
    'Store': config.adobe.storeViewCode,
    // Currency code - determines price display currency
    'Content-Currency': config.adobe.currencyCode,
  }

  // Add customer token if available (client-side only)
  // Server-side token is handled per-request in graphqlClient()
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(config.auth.customerTokenKey)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return { ...headers, ...customHeaders }
}

/**
 * Get headers for server-side requests with optional customer token
 */
export function getServerHeaders(customerToken?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Store': config.adobe.storeViewCode,
    'Content-Currency': config.adobe.currencyCode,
  }
  
  if (customerToken) {
    headers['Authorization'] = `Bearer ${customerToken}`
  }
  
  return headers
}

/**
 * Execute a GraphQL query against Adobe Commerce
 */
export async function graphqlClient<T>(
  options: GraphQLRequestOptions
): Promise<GraphQLResponse<T>> {
  const { query, variables, headers: customHeaders, cache, revalidate, tags } = options

  // On the server, try to read the customer token from the cookie
  let serverTokenHeader: Record<string, string> = {}
  if (typeof window === 'undefined') {
    const cookieToken = await getServerCookieToken()
    if (cookieToken) {
      serverTokenHeader = { Authorization: `Bearer ${cookieToken}` }
    }
  }

  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: createHeaders({ ...serverTokenHeader, ...customHeaders }),
    body: JSON.stringify({ query, variables }),
  }

  // Handle Next.js caching with tags support
  if (cache) {
    fetchOptions.cache = cache
  }

  // Build next options for ISR with optional tags
  const nextOptions: { revalidate?: number; tags?: string[] } = {}
  
  if (revalidate !== undefined) {
    nextOptions.revalidate = revalidate
  }
  
  if (tags?.length) {
    nextOptions.tags = tags
  }
  
  if (Object.keys(nextOptions).length > 0) {
    fetchOptions.next = nextOptions
  }

  try {
    console.log('[v0] GraphQL Request to:', config.adobe.graphqlEndpoint)
    console.log('[v0] Headers:', JSON.stringify(createHeaders(customHeaders)))
    console.log('[v0] Query preview:', query.substring(0, 200))
    
    const response = await fetch(config.adobe.graphqlEndpoint, fetchOptions)

    if (!response.ok) {
      // Try to get the error body for debugging
      const errorBody = await response.text()
      console.error('[v0] HTTP Error Response Body:', errorBody)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()
    console.log('[v0] Response received, has data:', !!json.data, 'has errors:', !!json.errors)

    if (json.errors) {
      console.error('[v0] GraphQL Errors:', JSON.stringify(json.errors, null, 2))

      // Detect expired/invalid token on the client side and notify the app
      if (typeof window !== 'undefined') {
        const isAuthError = json.errors.some((e: { message: string }) =>
          /unauthorized|not authorized|invalid token|expired/i.test(e.message)
        )
        if (isAuthError) {
          window.dispatchEvent(new CustomEvent('auth:session-expired'))
        }
      }
    }

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
