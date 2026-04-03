'use client'

import { useState, useCallback, useEffect } from 'react'
import { useCart } from '@/src/hooks/use-cart'
import { useCustomer } from '@/src/hooks/use-customer'
import {
  setShippingAddresses,
  setShippingMethods,
  setBillingAddress,
  setPaymentMethod,
  placeOrder,
} from '@/src/services/checkout.service'
import { setGuestEmailOnCart } from '@/src/services/cart.service'
import type {
  AddressInput,
  ShippingAddressInput,
  BillingAddressInput,
  ShippingMethodInput,
  PaymentMethodInput,
  Order,
} from '@/src/types/checkout.types'
import { useRouter } from 'next/navigation'

export type CheckoutStepEnum =
  | 'email'
  | 'shipping-address'
  | 'shipping-method'
  | 'billing-address'
  | 'payment-method'
  | 'review'

export function useCheckoutFlow() {
  const { cartId, cart, isLoading: isCartLoading, refresh: refreshCart, clearCart } = useCart()
  const { isAuthenticated, customer, isInitializing: isCustomerInitializing } = useCustomer()
  const router = useRouter()

  const isInitializing = isCartLoading || isCustomerInitializing

  const [currentStep, setCurrentStep] = useState<CheckoutStepEnum>('email')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Determine initial step based on auth status
  useEffect(() => {
    if (isInitializing) return
    if (isAuthenticated) {
      // If authenticaded, skip email step
      if (currentStep === 'email') setCurrentStep('shipping-address')
    }
  }, [isAuthenticated, isInitializing, currentStep])

  const handleSetGuestEmail = useCallback(
    async (email: string) => {
      if (!cartId) return false
      setIsProcessing(true)
      setError(null)
      try {
        const success = await setGuestEmailOnCart(cartId, email)
        if (success) {
          await refreshCart()
          setCurrentStep('shipping-address')
          return true
        }
        setError('No se pudo establecer el correo. Inténtalo de nuevo.')
        return false
      } catch (err: any) {
        setError(err.message || 'Error estableciendo correo.')
        return false
      } finally {
        setIsProcessing(false)
      }
    },
    [cartId, refreshCart]
  )

  const handleSetShippingAddress = useCallback(
    async (shippingAddress: ShippingAddressInput) => {
      if (!cartId) return false
      setIsProcessing(true)
      setError(null)
      try {
        const result = await setShippingAddresses(cartId, [shippingAddress])
        if (result) {
          await refreshCart() // refreshes available shipping methods
          setCurrentStep('shipping-method')
          return true
        }
        setError('Error al guardar la dirección de envío.')
        return false
      } catch (err: any) {
        setError(err.message || 'Error estableciendo la dirección.')
        return false
      } finally {
        setIsProcessing(false)
      }
    },
    [cartId, refreshCart]
  )

  const handleSetShippingMethod = useCallback(
    async (shippingMethod: ShippingMethodInput) => {
      if (!cartId) return false
      setIsProcessing(true)
      setError(null)
      try {
        const result = await setShippingMethods(cartId, [shippingMethod])
        if (result) {
          await refreshCart() // refreshes prices to include shipping amount
          setCurrentStep('billing-address')
          return true
        }
        setError('Error al guardar el método de envío.')
        return false
      } catch (err: any) {
        setError(err.message || 'Error estableciendo el método de envío.')
        return false
      } finally {
        setIsProcessing(false)
      }
    },
    [cartId, refreshCart]
  )

  const handleSetBillingAddress = useCallback(
    async (billingAddress: BillingAddressInput) => {
      if (!cartId) return false
      setIsProcessing(true)
      setError(null)
      try {
        const result = await setBillingAddress(cartId, billingAddress)
        if (result) {
          await refreshCart() // refreshes payment methods available
          setCurrentStep('payment-method')
          return true
        }
        setError('Error al guardar la dirección de facturación.')
        return false
      } catch (err: any) {
        setError(err.message || 'Error estableciendo la dirección de facturación.')
        return false
      } finally {
        setIsProcessing(false)
      }
    },
    [cartId, refreshCart]
  )

  const handleSetPaymentMethod = useCallback(
    async (paymentMethod: PaymentMethodInput) => {
      if (!cartId) return false
      setIsProcessing(true)
      setError(null)
      try {
        const result = await setPaymentMethod(cartId, paymentMethod)
        if (result) {
          await refreshCart()
          setCurrentStep('review')
          return true
        }
        setError('Error al guardar método de pago.')
        return false
      } catch (err: any) {
        setError(err.message || 'Error estableciendo método de pago.')
        return false
      } finally {
        setIsProcessing(false)
      }
    },
    [cartId, refreshCart]
  )

  const handlePlaceOrder = useCallback(async () => {
    if (!cartId) return null
    setIsProcessing(true)
    setError(null)
    try {
      const order = await placeOrder(cartId)
      if (order?.order_number) {
        // success! clear cart and redirect
        clearCart()
        router.push(`/checkout/success?orderId=${order.order_number}`)
        return order
      }
      setError('Error al crear la orden. Por favor intenta de nuevo.')
      return null
    } catch (err: any) {
      setError(err.message || 'Error al completar el pedido.')
      return null
    } finally {
      setIsProcessing(false)
    }
  }, [cartId, router, clearCart])

  return {
    cart,
    customer,
    isAuthenticated,
    isInitializing,
    isCartEmpty: !cartId || (cart && cart.items.length === 0),
    currentStep,
    setCurrentStep,
    isProcessing,
    error,
    handleSetGuestEmail,
    handleSetShippingAddress,
    handleSetShippingMethod,
    handleSetBillingAddress,
    handleSetPaymentMethod,
    handlePlaceOrder,
  }
}
