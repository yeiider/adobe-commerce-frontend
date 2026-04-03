/**
 * Format Utilities
 * Formatting functions for prices, dates, etc.
 */

import { Money } from '@/src/types/common.types'
import { config } from '@/src/config/env'

/**
 * Normalize locale format from underscore to hyphen (es_CO -> es-CO)
 * Falls back to 'en-US' if locale is invalid or empty
 */
function normalizeLocale(locale: string | undefined | null): string {
  if (!locale) return 'en-US'
  const normalized = locale.replace(/_/g, '-')
  // Validate the locale format (basic check)
  if (!/^[a-z]{2}(-[A-Z]{2})?$/i.test(normalized)) {
    return 'en-US'
  }
  return normalized
}

/**
 * Format price with currency
 * @param price - Money object or number value
 * @param currencyCode - Currency code (required if price is a number)
 */
export function formatPrice(price: Money | number, currencyCode?: string): string {
  const value = typeof price === 'number' ? price : price.value
  const currency = typeof price === 'number' 
    ? (currencyCode || config.adobe.currencyCode || 'USD') 
    : (currencyCode || price.currency || 'USD')
  
  // Normalize locale from es_CO to es-CO format
  const rawLocale = config.adobe.locale || 'en-US'
  const locale = rawLocale.replace(/_/g, '-')

  // Some currencies like COP typically don't show decimals
  const currenciesWithoutDecimals = ['COP', 'JPY', 'KRW', 'VND']
  const minimumFractionDigits = currenciesWithoutDecimals.includes(currency) ? 0 : 2
  const maximumFractionDigits = currenciesWithoutDecimals.includes(currency) ? 0 : 2

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value)
  } catch {
    // Fallback to en-US if locale is invalid
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value)
  }
}

/**
 * Format price range
 */
export function formatPriceRange(min: Money, max?: Money): string {
  if (!max || min.value === max.value) {
    return formatPrice(min)
  }
  return `${formatPrice(min)} - ${formatPrice(max)}`
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(originalPrice: number, finalPrice: number): number {
  if (originalPrice <= 0) return 0
  return Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
}

/**
 * Format date
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const locale = normalizeLocale(config.adobe.locale)
  return new Intl.DateTimeFormat(locale, options).format(dateObj)
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  }

  const locale = normalizeLocale(config.adobe.locale)
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds)
    if (interval >= 1) {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
      return rtf.format(-interval, unit as Intl.RelativeTimeFormatUnit)
    }
  }

  return 'just now'
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Strip HTML tags from string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Basic US format, can be extended for international
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

/**
 * Format order number with prefix
 */
export function formatOrderNumber(orderNumber: string): string {
  return `#${orderNumber}`
}
