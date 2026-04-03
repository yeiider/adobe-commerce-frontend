/**
 * Customer Types
 * All customer-related TypeScript types for Adobe Commerce
 */

import { Money, Region, PageInfo } from './common.types'

// Customer Address
export interface CustomerAddress {
  id: number
  firstname: string
  lastname: string
  company?: string
  street: string[]
  city: string
  region?: Region
  postcode: string
  country_code: string
  telephone: string
  default_shipping: boolean
  default_billing: boolean
}

// Customer
export interface Customer {
  id: number
  firstname: string
  lastname: string
  email: string
  is_subscribed: boolean
  created_at: string
  date_of_birth?: string
  gender?: number
  taxvat?: string
  prefix?: string
  suffix?: string
  middlename?: string
  addresses: CustomerAddress[]
  default_shipping?: string
  default_billing?: string
}

// Customer Input
export interface CustomerCreateInput {
  firstname: string
  lastname: string
  email: string
  password: string
  is_subscribed?: boolean
  date_of_birth?: string
  gender?: number
  prefix?: string
  suffix?: string
  middlename?: string
  taxvat?: string
}

export interface CustomerUpdateInput {
  firstname?: string
  lastname?: string
  email?: string
  is_subscribed?: boolean
  date_of_birth?: string
  gender?: number
  prefix?: string
  suffix?: string
  middlename?: string
  taxvat?: string
}

// Customer Order Types
export interface OrderDiscount {
  amount: Money
  label: string
}

export interface OrderTotal {
  grand_total: Money
  subtotal: Money
  total_shipping: Money
  total_tax: Money
  discounts?: OrderDiscount[]
}

export interface OrderPaymentMethod {
  name: string
  type: string
}

export interface OrderAddress {
  firstname: string
  lastname: string
  street: string[]
  city: string
  region: string
  postcode: string
  country_code: string
  telephone: string
}

export interface OrderItem {
  id: string
  product_name: string
  product_sku: string
  product_url_key: string
  product_sale_price: Money
  quantity_ordered: number
  quantity_shipped: number
  quantity_canceled: number
  quantity_invoiced: number
  quantity_refunded: number
  status: string
  discounts?: OrderDiscount[]
  product?: {
    thumbnail?: {
      url: string
      label?: string
    }
  }
}

export interface CustomerOrder {
  id: string
  number: string
  order_date: string
  status: string
  shipping_method?: string
  payment_methods: OrderPaymentMethod[]
  total: OrderTotal
  billing_address?: OrderAddress
  shipping_address?: OrderAddress
  items: OrderItem[]
}

export interface CustomerOrdersResponse {
  total_count: number
  page_info: PageInfo
  items: CustomerOrder[]
}

// Wishlist Types
export interface WishlistItem {
  id: string
  quantity: number
  description?: string
  added_at: string
  product: {
    uid: string
    sku: string
    name: string
    url_key: string
    thumbnail?: {
      url: string
      label?: string
    }
    price_range: {
      minimum_price: {
        regular_price: Money
        final_price: Money
      }
    }
    stock_status: string
  }
}

export interface Wishlist {
  id: string
  items_count: number
  sharing_code: string
  updated_at: string
  items_v2: {
    items: WishlistItem[]
    page_info: PageInfo
  }
}

// Auth Types
export interface CustomerToken {
  token: string
}

export interface AuthResponse {
  generateCustomerToken: CustomerToken
}
