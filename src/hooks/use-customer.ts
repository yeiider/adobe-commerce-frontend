/**
 * Customer Hook
 * Custom hook for customer/auth management with SWR
 */

'use client'

import useSWR from 'swr'
import { useCallback, useEffect, useState } from 'react'
import {
  getCustomer,
  generateCustomerToken,
  revokeCustomerToken,
  createCustomer,
  updateCustomer,
  storeCustomerToken,
  getStoredCustomerToken,
  clearStoredCustomerToken,
} from '@/src/services/customer.service'
import { Customer, CustomerCreateInput, CustomerUpdateInput } from '@/src/types/customer.types'

const CUSTOMER_KEY = 'adobe-commerce-customer'

export function useCustomer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for stored token on mount
  useEffect(() => {
    const token = getStoredCustomerToken()
    setIsAuthenticated(!!token)
  }, [])

  // Fetch customer data
  const {
    data: customer,
    error,
    isLoading,
    mutate,
  } = useSWR<Customer | null>(
    isAuthenticated ? CUSTOMER_KEY : null,
    () => getCustomer(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError: () => {
        // Token might be expired, clear it
        clearStoredCustomerToken()
        setIsAuthenticated(false)
      },
    }
  )

  // Login
  const login = useCallback(
    async (email: string, password: string) => {
      const token = await generateCustomerToken(email, password)
      if (token) {
        storeCustomerToken(token)
        setIsAuthenticated(true)
        mutate()
        return true
      }
      return false
    },
    [mutate]
  )

  // Logout
  const logout = useCallback(async () => {
    await revokeCustomerToken()
    clearStoredCustomerToken()
    setIsAuthenticated(false)
    mutate(null, false)
  }, [mutate])

  // Register
  const register = useCallback(
    async (input: CustomerCreateInput) => {
      const newCustomer = await createCustomer(input)
      if (newCustomer) {
        // Auto-login after registration
        const token = await generateCustomerToken(input.email, input.password)
        if (token) {
          storeCustomerToken(token)
          setIsAuthenticated(true)
          mutate(newCustomer, false)
        }
        return newCustomer
      }
      return null
    },
    [mutate]
  )

  // Update customer
  const update = useCallback(
    async (input: CustomerUpdateInput) => {
      const updatedCustomer = await updateCustomer(input)
      if (updatedCustomer) {
        mutate(updatedCustomer, false)
      }
      return updatedCustomer
    },
    [mutate]
  )

  return {
    customer,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    update,
    refresh: mutate,
  }
}
