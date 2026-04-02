/**
 * Format Utilities
 * Formatting functions for prices, dates, etc.
 */

import { Money } from '@/types/common.types'
import { config } from '@/config/env'

/**
 * Format price with currency
 */
export function formatPrice(price: Money | number, currencyCode?: string): string {
  const value = typeof price === 'number' ? price : price.value
  const currency = typeof price === 'number' ? currencyCode || config.adobe.currencyCode : price.currency

  return new Intl.NumberFormat(config.adobe.locale, {
    style: 'currency',
    currency: currency,
  }).format(value)
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
  return new Intl.DateTimeFormat(config.adobe.locale, options).format(dateObj)
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

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds)
    if (interval >= 1) {
      const rtf = new Intl.RelativeTimeFormat(config.adobe.locale, { numeric: 'auto' })
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
