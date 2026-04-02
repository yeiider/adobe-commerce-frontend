/**
 * Customer Service
 * Business logic for customer operations
 */

import { graphqlClient } from '@/src/lib/graphql/client'
import {
  GET_CUSTOMER,
  GET_CUSTOMER_ADDRESSES,
  GET_CUSTOMER_ORDERS,
  GET_CUSTOMER_ORDER,
  GET_CUSTOMER_WISHLISTS,
  IS_EMAIL_AVAILABLE,
} from '@/src/lib/graphql/queries/customer.queries'
import {
  CREATE_CUSTOMER,
  GENERATE_CUSTOMER_TOKEN,
  REVOKE_CUSTOMER_TOKEN,
  UPDATE_CUSTOMER,
  CHANGE_CUSTOMER_PASSWORD,
  REQUEST_PASSWORD_RESET_EMAIL,
  RESET_PASSWORD,
  CREATE_CUSTOMER_ADDRESS,
  UPDATE_CUSTOMER_ADDRESS,
  DELETE_CUSTOMER_ADDRESS,
  SUBSCRIBE_EMAIL_TO_NEWSLETTER,
} from '@/src/lib/graphql/mutations/customer.mutations'
import {
  Customer,
  CustomerAddress,
  CustomerCreateInput,
  CustomerUpdateInput,
  CustomerOrder,
  CustomerOrdersResponse,
  Wishlist,
  CustomerToken,
} from '@/src/types/customer.types'
import { config } from '@/src/config/env'

/**
 * Create a new customer
 */
export async function createCustomer(input: CustomerCreateInput): Promise<Customer | null> {
  const { data, errors } = await graphqlClient<{
    createCustomerV2: { customer: Customer }
  }>({
    query: CREATE_CUSTOMER,
    variables: { input },
    cache: 'no-store',
  })

  if (errors || !data?.createCustomerV2?.customer) {
    return null
  }

  return data.createCustomerV2.customer
}

/**
 * Generate customer token (login)
 */
export async function generateCustomerToken(email: string, password: string): Promise<string | null> {
  const { data, errors } = await graphqlClient<{
    generateCustomerToken: CustomerToken
  }>({
    query: GENERATE_CUSTOMER_TOKEN,
    variables: { email, password },
    cache: 'no-store',
  })

  if (errors || !data?.generateCustomerToken?.token) {
    return null
  }

  return data.generateCustomerToken.token
}

/**
 * Revoke customer token (logout)
 */
export async function revokeCustomerToken(): Promise<boolean> {
  const { data, errors } = await graphqlClient<{
    revokeCustomerToken: { result: boolean }
  }>({
    query: REVOKE_CUSTOMER_TOKEN,
    cache: 'no-store',
  })

  return !errors && data?.revokeCustomerToken?.result === true
}

/**
 * Get current customer
 */
export async function getCustomer(): Promise<Customer | null> {
  const { data, errors } = await graphqlClient<{ customer: Customer }>({
    query: GET_CUSTOMER,
    cache: 'no-store',
  })

  if (errors || !data?.customer) {
    return null
  }

  return data.customer
}

/**
 * Update customer
 */
export async function updateCustomer(input: CustomerUpdateInput): Promise<Customer | null> {
  const { data, errors } = await graphqlClient<{
    updateCustomerV2: { customer: Customer }
  }>({
    query: UPDATE_CUSTOMER,
    variables: { input },
    cache: 'no-store',
  })

  if (errors || !data?.updateCustomerV2?.customer) {
    return null
  }

  return data.updateCustomerV2.customer
}

/**
 * Change customer password
 */
export async function changeCustomerPassword(
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  const { data, errors } = await graphqlClient<{
    changeCustomerPassword: { email: string }
  }>({
    query: CHANGE_CUSTOMER_PASSWORD,
    variables: { currentPassword, newPassword },
    cache: 'no-store',
  })

  return !errors && !!data?.changeCustomerPassword?.email
}

/**
 * Request password reset email
 */
export async function requestPasswordResetEmail(email: string): Promise<boolean> {
  const { data, errors } = await graphqlClient<{
    requestPasswordResetEmail: boolean
  }>({
    query: REQUEST_PASSWORD_RESET_EMAIL,
    variables: { email },
    cache: 'no-store',
  })

  return !errors && data?.requestPasswordResetEmail === true
}

/**
 * Reset password
 */
export async function resetPassword(
  email: string,
  resetPasswordToken: string,
  newPassword: string
): Promise<boolean> {
  const { data, errors } = await graphqlClient<{ resetPassword: boolean }>({
    query: RESET_PASSWORD,
    variables: { email, resetPasswordToken, newPassword },
    cache: 'no-store',
  })

  return !errors && data?.resetPassword === true
}

/**
 * Get customer addresses
 */
export async function getCustomerAddresses(): Promise<CustomerAddress[] | null> {
  const { data, errors } = await graphqlClient<{
    customer: { addresses: CustomerAddress[] }
  }>({
    query: GET_CUSTOMER_ADDRESSES,
    cache: 'no-store',
  })

  if (errors || !data?.customer?.addresses) {
    return null
  }

  return data.customer.addresses
}

/**
 * Create customer address
 */
export async function createCustomerAddress(
  input: Omit<CustomerAddress, 'id'>
): Promise<CustomerAddress | null> {
  const { data, errors } = await graphqlClient<{
    createCustomerAddress: CustomerAddress
  }>({
    query: CREATE_CUSTOMER_ADDRESS,
    variables: { input },
    cache: 'no-store',
  })

  if (errors || !data?.createCustomerAddress) {
    return null
  }

  return data.createCustomerAddress
}

/**
 * Update customer address
 */
export async function updateCustomerAddress(
  id: number,
  input: Partial<CustomerAddress>
): Promise<CustomerAddress | null> {
  const { data, errors } = await graphqlClient<{
    updateCustomerAddress: CustomerAddress
  }>({
    query: UPDATE_CUSTOMER_ADDRESS,
    variables: { id, input },
    cache: 'no-store',
  })

  if (errors || !data?.updateCustomerAddress) {
    return null
  }

  return data.updateCustomerAddress
}

/**
 * Delete customer address
 */
export async function deleteCustomerAddress(id: number): Promise<boolean> {
  const { data, errors } = await graphqlClient<{ deleteCustomerAddress: boolean }>({
    query: DELETE_CUSTOMER_ADDRESS,
    variables: { id },
    cache: 'no-store',
  })

  return !errors && data?.deleteCustomerAddress === true
}

/**
 * Get customer orders
 */
export async function getCustomerOrders(
  filter?: Record<string, unknown>,
  pageSize: number = 10,
  currentPage: number = 1
): Promise<CustomerOrdersResponse | null> {
  const { data, errors } = await graphqlClient<{
    customer: { orders: CustomerOrdersResponse }
  }>({
    query: GET_CUSTOMER_ORDERS,
    variables: { filter, pageSize, currentPage },
    cache: 'no-store',
  })

  if (errors || !data?.customer?.orders) {
    return null
  }

  return data.customer.orders
}

/**
 * Get single customer order
 */
export async function getCustomerOrder(orderNumber: string): Promise<CustomerOrder | null> {
  const { data, errors } = await graphqlClient<{
    customer: { orders: { items: CustomerOrder[] } }
  }>({
    query: GET_CUSTOMER_ORDER,
    variables: { orderNumber },
    cache: 'no-store',
  })

  if (errors || !data?.customer?.orders?.items?.length) {
    return null
  }

  return data.customer.orders.items[0]
}

/**
 * Get customer wishlists
 */
export async function getCustomerWishlists(): Promise<Wishlist[] | null> {
  const { data, errors } = await graphqlClient<{
    customer: { wishlists: Wishlist[] }
  }>({
    query: GET_CUSTOMER_WISHLISTS,
    cache: 'no-store',
  })

  if (errors || !data?.customer?.wishlists) {
    return null
  }

  return data.customer.wishlists
}

/**
 * Check if email is available
 */
export async function isEmailAvailable(email: string): Promise<boolean> {
  const { data, errors } = await graphqlClient<{
    isEmailAvailable: { is_email_available: boolean }
  }>({
    query: IS_EMAIL_AVAILABLE,
    variables: { email },
    cache: 'no-store',
  })

  return !errors && data?.isEmailAvailable?.is_email_available === true
}

/**
 * Subscribe to newsletter
 */
export async function subscribeToNewsletter(email: string): Promise<boolean> {
  const { data, errors } = await graphqlClient<{
    subscribeEmailToNewsletter: { status: string }
  }>({
    query: SUBSCRIBE_EMAIL_TO_NEWSLETTER,
    variables: { email },
    cache: 'no-store',
  })

  return !errors && data?.subscribeEmailToNewsletter?.status === 'SUBSCRIBED'
}

/**
 * Store customer token (client-side helper)
 */
export function storeCustomerToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(config.auth.customerTokenKey, token)
}

/**
 * Get stored customer token (client-side helper)
 */
export function getStoredCustomerToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(config.auth.customerTokenKey)
}

/**
 * Clear stored customer token (client-side helper)
 */
export function clearStoredCustomerToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(config.auth.customerTokenKey)
}
