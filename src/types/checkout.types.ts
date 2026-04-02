/**
 * Checkout Types
 * All checkout-related TypeScript types for Adobe Commerce
 */

import { Region, UserError } from './common.types'

// Country Types
export interface AvailableRegion {
  id: number
  code: string
  name: string
}

export interface Country {
  id: string
  two_letter_abbreviation: string
  three_letter_abbreviation: string
  full_name_locale: string
  full_name_english: string
  available_regions?: AvailableRegion[]
}

// Address Input Types
export interface AddressInput {
  firstname: string
  lastname: string
  company?: string
  street: string[]
  city: string
  region?: string
  region_id?: number
  postcode: string
  country_code: string
  telephone: string
  save_in_address_book?: boolean
}

export interface ShippingAddressInput {
  address: AddressInput
  customer_address_id?: number
  customer_notes?: string
  pickup_location_code?: string
}

export interface BillingAddressInput {
  address?: AddressInput
  customer_address_id?: number
  same_as_shipping?: boolean
  use_for_shipping?: boolean
}

// Shipping Method Input
export interface ShippingMethodInput {
  carrier_code: string
  method_code: string
}

// Payment Method Input
export interface PaymentMethodInput {
  code: string
  purchase_order_number?: string
}

// Order Types
export interface Order {
  order_number: string
  order_id: string
}

export interface PlaceOrderResponse {
  placeOrder: {
    order: Order
    errors?: UserError[]
  }
}

// Checkout Steps
export type CheckoutStep = 'shipping' | 'payment' | 'review'

// Checkout State
export interface CheckoutState {
  step: CheckoutStep
  shippingAddress?: AddressInput
  billingAddress?: AddressInput
  shippingMethod?: ShippingMethodInput
  paymentMethod?: PaymentMethodInput
  email?: string
  isGuest: boolean
}
