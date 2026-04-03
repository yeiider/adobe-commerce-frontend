'use client'


import Link from 'next/link'
import { EmptyCart } from '@/src/components/cart/EmptyCart'
import { OrderSummary } from '@/src/components/checkout/OrderSummary'
import { GuestEmailStep } from '@/src/components/checkout/steps/GuestEmailStep'
import { ShippingAddressStep } from '@/src/components/checkout/steps/ShippingAddressStep'
import { ShippingMethodStep } from '@/src/components/checkout/steps/ShippingMethodStep'
import { BillingAddressStep } from '@/src/components/checkout/steps/BillingAddressStep'
import { PaymentMethodStep } from '@/src/components/checkout/steps/PaymentMethodStep'
import { useCheckoutFlow, type CheckoutStepEnum } from '@/src/hooks/use-checkout-flow'
import type { AddressInput } from '@/src/types/checkout.types'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

// Define the step sequence rules to easily map states
const STEPS_ORDER: CheckoutStepEnum[] = [
  'email',
  'shipping-address',
  'shipping-method',
  'billing-address',
  'payment-method',
  'review'
]

export default function CheckoutPage() {
  const {
    cart,
    isAuthenticated,
    isInitializing,
    isCartEmpty,
    currentStep,
    isProcessing,
    error,
    handleSetGuestEmail,
    handleSetShippingAddress,
    handleSetShippingMethod,
    handleSetBillingAddress,
    handleSetPaymentMethod,
    handlePlaceOrder
  } = useCheckoutFlow()

  if (isInitializing) {
    return (
      <div className="container mx-auto py-24 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground text-primary" />
      </div>
    )
  }

  if (isCartEmpty) {
    return (
      <div className="container mx-auto px-4 py-16 h-[60vh] flex items-center justify-center">
        <EmptyCart message="Tu carrito de compras está vacío." />
      </div>
    )
  }

  if (!cart) return null // Fallback safety

  const stepIndex = STEPS_ORDER.indexOf(currentStep)
  const isStepCompleted = (step: CheckoutStepEnum) => STEPS_ORDER.indexOf(step) < stepIndex
  const isStepActive = (step: CheckoutStepEnum) => currentStep === step

  const shippingAddresses = cart.shipping_addresses || []
  const availableShippingMethods = shippingAddresses[0]?.available_shipping_methods || []
  const selectedShippingMethod = shippingAddresses[0]?.selected_shipping_method
  
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 rounded-md border border-destructive/30 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Left Column: Steps */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Guest Email */}
          {!isAuthenticated && (
            <GuestEmailStep
              onSave={handleSetGuestEmail}
              isProcessing={isProcessing && isStepActive('email')}
              isActive={isStepActive('email')}
              isCompleted={isStepCompleted('email')}
              defaultEmail={cart.email}
            />
          )}

          {/* 2. Shipping Address */}
          <ShippingAddressStep
            onSave={handleSetShippingAddress}
            isProcessing={isProcessing && isStepActive('shipping-address')}
            isActive={isStepActive('shipping-address')}
            isCompleted={isStepCompleted('shipping-address')}
            completedAddress={shippingAddresses[0] as unknown as AddressInput}
          />

          {/* 3. Shipping Method */}
          <ShippingMethodStep
            availableMethods={availableShippingMethods}
            completedMethod={selectedShippingMethod}
            onSave={handleSetShippingMethod}
            isProcessing={isProcessing && isStepActive('shipping-method')}
            isActive={isStepActive('shipping-method')}
            isCompleted={isStepCompleted('shipping-method')}
          />

          {/* 4. Billing Address */}
          <BillingAddressStep
            onSave={handleSetBillingAddress}
            isProcessing={isProcessing && isStepActive('billing-address')}
            isActive={isStepActive('billing-address')}
            isCompleted={isStepCompleted('billing-address')}
            shippingAddress={shippingAddresses[0] as unknown as AddressInput}
          />

          {/* 5. Payment Method */}
          <PaymentMethodStep
            availableMethods={cart.available_payment_methods || []}
            completedMethod={cart.selected_payment_method}
            onSave={handleSetPaymentMethod}
            isProcessing={isProcessing && isStepActive('payment-method')}
            isActive={isStepActive('payment-method')}
            isCompleted={isStepCompleted('payment-method')}
          />

          {/* 6. Review & Place Order */}
          {currentStep === 'review' && (
            <div className="rounded-md border p-6 bg-card shadow-sm mt-8">
              <h3 className="text-lg font-medium mb-4">Revisar y Confirmar Pedido</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Por favor revisa el resumen de tu pedido y asegúrate de que toda la información esté correcta antes de proceder.
              </p>
              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full h-12 text-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Procesando Orden...
                  </>
                ) : (
                  'Realizar Pedido'
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary cart={cart} />
        </div>

      </div>
    </div>
  )
}
