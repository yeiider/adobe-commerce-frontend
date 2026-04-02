/**
 * Cart Types
 * All cart-related TypeScript types for Adobe Commerce
 */

import { Money, Address, UserError } from './common.types'
import { Product } from './product.types'

// Cart Item Types
export interface CartItemPrices {
  price: Money
  row_total: Money
  row_total_including_tax: Money
  discounts?: Array<{
    amount: Money
    label: string
  }>
}

export interface ConfigurableCartItemOption {
  id: number
  option_label: string
  value_id: number
  value_label: string
}

export interface BundleCartItemValue {
  id: number
  label: string
  price: number
  quantity: number
}

export interface BundleCartItemOption {
  uid: string
  label: string
  type: string
  values: BundleCartItemValue[]
}

export interface CartItem {
  uid: string
  quantity: number
  prices: CartItemPrices
  product: Pick<Product, 'uid' | 'sku' | 'name' | 'url_key' | 'thumbnail' | 'stock_status'>
  configurable_options?: ConfigurableCartItemOption[]
  bundle_options?: BundleCartItemOption[]
}

// Cart Prices
export interface CartDiscount {
  amount: Money
  label: string
}

export interface CartTax {
  amount: Money
  label: string
}

export interface CartPrices {
  grand_total: Money
  subtotal_excluding_tax: Money
  subtotal_including_tax: Money
  subtotal_with_discount_excluding_tax: Money
  applied_taxes: CartTax[]
  discounts?: CartDiscount[]
}

// Shipping Types
export interface ShippingMethod {
  carrier_code: string
  carrier_title: string
  method_code: string
  method_title: string
  amount: Money
  price_excl_tax?: Money
  price_incl_tax?: Money
  available?: boolean
  error_message?: string
}

export interface ShippingAddress extends Address {
  available_shipping_methods?: ShippingMethod[]
  selected_shipping_method?: ShippingMethod
}

// Payment Types
export interface PaymentMethod {
  code: string
  title: string
}

export interface AppliedCoupon {
  code: string
}

// Cart Type
export interface Cart {
  id: string
  email?: string
  is_virtual: boolean
  total_quantity: number
  items: CartItem[]
  prices: CartPrices
  shipping_addresses: ShippingAddress[]
  billing_address?: Address
  available_payment_methods: PaymentMethod[]
  selected_payment_method?: PaymentMethod
  applied_coupons?: AppliedCoupon[]
}

// Cart Input Types
export interface CartItemInput {
  sku: string
  quantity: number
  selected_options?: string[]
  entered_options?: Array<{
    uid: string
    value: string
  }>
}

export interface CartItemUpdateInput {
  cart_item_uid: string
  quantity: number
}

// Cart Response Types
export interface AddToCartResponse {
  addProductsToCart: {
    cart: Cart
    user_errors: UserError[]
  }
}

export interface UpdateCartResponse {
  updateCartItems: {
    cart: Cart
  }
}

export interface RemoveFromCartResponse {
  removeItemFromCart: {
    cart: Cart
  }
}
