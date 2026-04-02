/**
 * Checkout Service
 * Business logic for checkout operations
 */

import { graphqlClient } from '@/lib/graphql/client'
import { GET_COUNTRIES, GET_COUNTRY } from '@/lib/graphql/queries/checkout.queries'
import {
  SET_SHIPPING_ADDRESSES_ON_CART,
  SET_BILLING_ADDRESS_ON_CART,
  SET_SHIPPING_METHODS_ON_CART,
  SET_PAYMENT_METHOD_ON_CART,
  PLACE_ORDER,
} from '@/lib/graphql/mutations/checkout.mutations'
import {
  Country,
  ShippingAddressInput,
  BillingAddressInput,
  ShippingMethodInput,
  PaymentMethodInput,
  Order,
  PlaceOrderResponse,
} from '@/types/checkout.types'
import { ShippingAddress } from '@/types/cart.types'
import { config } from '@/config/env'

/**
 * Get all countries
 */
export async function getCountries(): Promise<Country[] | null> {
  const { data, errors } = await graphqlClient<{ countries: Country[] }>({
    query: GET_COUNTRIES,
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.countries) {
    return null
  }

  return data.countries
}

/**
 * Get country by ID
 */
export async function getCountry(id: string): Promise<Country | null> {
  const { data, errors } = await graphqlClient<{ country: Country }>({
    query: GET_COUNTRY,
    variables: { id },
    revalidate: config.cache.revalidateTime,
  })

  if (errors || !data?.country) {
    return null
  }

  return data.country
}

/**
 * Set shipping addresses on cart
 */
export async function setShippingAddresses(
  cartId: string,
  shippingAddresses: ShippingAddressInput[]
): Promise<ShippingAddress[] | null> {
  const { data, errors } = await graphqlClient<{
    setShippingAddressesOnCart: { cart: { shipping_addresses: ShippingAddress[] } }
  }>({
    query: SET_SHIPPING_ADDRESSES_ON_CART,
    variables: { cartId, shippingAddresses },
    cache: 'no-store',
  })

  if (errors || !data?.setShippingAddressesOnCart?.cart?.shipping_addresses) {
    return null
  }

  return data.setShippingAddressesOnCart.cart.shipping_addresses
}

/**
 * Set billing address on cart
 */
export async function setBillingAddress(
  cartId: string,
  billingAddress: BillingAddressInput
): Promise<boolean> {
  const { data, errors } = await graphqlClient<{
    setBillingAddressOnCart: { cart: { billing_address: unknown } }
  }>({
    query: SET_BILLING_ADDRESS_ON_CART,
    variables: { cartId, billingAddress },
    cache: 'no-store',
  })

  return !errors && !!data?.setBillingAddressOnCart?.cart?.billing_address
}

/**
 * Set shipping methods on cart
 */
export async function setShippingMethods(
  cartId: string,
  shippingMethods: ShippingMethodInput[]
): Promise<boolean> {
  const { data, errors } = await graphqlClient<{
    setShippingMethodsOnCart: { cart: { shipping_addresses: Array<{ selected_shipping_method: unknown }> } }
  }>({
    query: SET_SHIPPING_METHODS_ON_CART,
    variables: { cartId, shippingMethods },
    cache: 'no-store',
  })

  return !errors && !!data?.setShippingMethodsOnCart?.cart?.shipping_addresses?.[0]?.selected_shipping_method
}

/**
 * Set payment method on cart
 */
export async function setPaymentMethod(
  cartId: string,
  paymentMethod: PaymentMethodInput
): Promise<boolean> {
  const { data, errors } = await graphqlClient<{
    setPaymentMethodOnCart: { cart: { selected_payment_method: unknown } }
  }>({
    query: SET_PAYMENT_METHOD_ON_CART,
    variables: { cartId, paymentMethod },
    cache: 'no-store',
  })

  return !errors && !!data?.setPaymentMethodOnCart?.cart?.selected_payment_method
}

/**
 * Place order
 */
export async function placeOrder(cartId: string): Promise<Order | null> {
  const { data, errors } = await graphqlClient<PlaceOrderResponse>({
    query: PLACE_ORDER,
    variables: { cartId },
    cache: 'no-store',
  })

  if (errors || !data?.placeOrder?.order) {
    return null
  }

  return data.placeOrder.order
}
