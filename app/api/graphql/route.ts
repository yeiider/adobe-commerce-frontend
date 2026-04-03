/**
 * GraphQL Proxy Route
 * Proxies client-side GraphQL requests to Adobe Commerce.
 * This avoids CORS issues and allows the token to be forwarded securely.
 */

import { NextRequest, NextResponse } from 'next/server'

const MAGENTO_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_ADOBE_COMMERCE_GRAPHQL_URL ||
  'https://magento.goline.com.co/graphql'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    const forwardHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Forward store/currency headers sent by the client
    const store = request.headers.get('Store')
    if (store) forwardHeaders['Store'] = store

    const currency = request.headers.get('Content-Currency')
    if (currency) forwardHeaders['Content-Currency'] = currency

    // Forward Authorization header (customer token from localStorage via client)
    const auth = request.headers.get('Authorization')
    if (auth) forwardHeaders['Authorization'] = auth

    // Fallback: read token from cookie (set after login for server-side use)
    if (!auth) {
      const tokenCookie = request.cookies.get('adobe_commerce_customer_token')
      if (tokenCookie?.value) {
        forwardHeaders['Authorization'] = `Bearer ${tokenCookie.value}`
      }
    }

    const magentoResponse = await fetch(MAGENTO_GRAPHQL_URL, {
      method: 'POST',
      headers: forwardHeaders,
      body,
    })

    if (!magentoResponse.ok) {
      const errorText = await magentoResponse.text()
      console.error('[GraphQL Proxy] Magento error:', magentoResponse.status, errorText)
      return NextResponse.json(
        { errors: [{ message: `Upstream error: ${magentoResponse.status}` }] },
        { status: magentoResponse.status }
      )
    }

    const data = await magentoResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[GraphQL Proxy] Unexpected error:', error)
    return NextResponse.json(
      { errors: [{ message: 'Internal proxy error' }] },
      { status: 500 }
    )
  }
}
