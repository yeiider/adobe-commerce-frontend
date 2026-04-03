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

  try {
    console.log('[v0] GraphQL Request to:', config.adobe.graphqlEndpoint)
    const requestHeaders = createHeaders({ ...serverTokenHeader, ...customHeaders }) as Record<string, string>
    console.log('[v0] Query preview:', query.substring(0, 100))

    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({ query, variables }),
    }

    if (cache) fetchOptions.cache = cache

    const nextOptions: { revalidate?: number; tags?: string[] } = {}
    if (revalidate !== undefined) nextOptions.revalidate = revalidate
    if (tags?.length) nextOptions.tags = tags
    if (Object.keys(nextOptions).length > 0) fetchOptions.next = nextOptions

    const response = await fetch(config.adobe.graphqlEndpoint, fetchOptions)

    let json: any
    let responseText = ''
    try {
      responseText = await response.text()
      // Safely strip BOM if exists
      if (responseText.charCodeAt(0) === 0xFEFF) {
        responseText = responseText.slice(1)
      }
      
      // Sometimes Magento wraps the JSON in literal quotes
      if (responseText.startsWith('"') && responseText.endsWith('"')) {
        try {
          responseText = JSON.parse(responseText)
        } catch {}
      }

      if (responseText) {
        json = typeof responseText === 'string' ? JSON.parse(responseText) : responseText
      }
    } catch (e) {
      // Don't throw immediately, we will evaluate if this was an auth error from raw text
    }

    // Attempt to determine if it is an auth error, either from JSON or raw text
    let isAuthError = false
    
    if (json?.errors) {
      isAuthError = json.errors.some((e: any) =>
        e.extensions?.category === 'graphql-authentication' || /unauthorized|not authorized|invalid token|expired/i.test(e.message)
      )
    } else if (!response.ok && responseText) {
      isAuthError = /graphql-authentication|unauthorized|not authorized|invalid token|expired/i.test(responseText)
    }

    if (isAuthError && requestHeaders['Authorization']) {
      // Detect expired/invalid token on the client side and notify the app
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:session-expired'))
      }
      
      // Retry the request anonymously
      console.warn('[v0] Token expired. Retrying request anonymously...')
      const { Authorization, ...anonymousHeaders } = requestHeaders
      
      const retryOptions: RequestInit = {
        ...fetchOptions,
        headers: anonymousHeaders
      }
      
      const retryResponse = await fetch(config.adobe.graphqlEndpoint, retryOptions)
      const retryJson = await retryResponse.json()
      return retryJson as GraphQLResponse<T>
    }

    // If it's a real HTTP error and NOT an auth error we could recover from
    if (!response.ok && (!json || !json.data)) {
      console.error('[v0] HTTP Error Response Body:', responseText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (json?.errors) {
      console.error('[v0] GraphQL Errors:', JSON.stringify(json.errors, null, 2))
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
