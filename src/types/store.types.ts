/**
 * Store Types
 * All store configuration TypeScript types for Adobe Commerce
 */

/**
 * Core Store Configuration
 * Essential fields for storefront operation
 */
export interface StoreConfigCore {
  store_code: string
  store_name: string
  locale: string
  timezone: string
  base_currency_code: string
  default_display_currency_code: string
  base_url: string
  secure_base_media_url: string
  logo_alt: string | null
  copyright: string | null
  show_cms_breadcrumbs: boolean
  grid_per_page: number
  root_category_id: number
  category_url_suffix: string | null
  product_url_suffix: string | null
}

/**
 * Full Store Configuration
 * All available fields from storeConfig query
 */
export interface StoreConfig extends Partial<StoreConfigCore> {
  id?: number
  code?: string
  website_id?: number
  locale: string
  base_currency_code: string
  default_display_currency_code: string
  timezone: string
  weight_unit?: string
  base_url: string
  base_link_url?: string
  base_static_url?: string
  base_media_url?: string
  secure_base_url?: string
  secure_base_link_url?: string
  secure_base_static_url?: string
  secure_base_media_url: string
  store_name: string
  store_code?: string
  store_group_name?: string
  store_sort_order?: number
  root_category_id: number
  root_category_uid?: string
  default_title?: string
  default_keywords?: string
  default_description?: string
  head_shortcut_icon?: string
  header_logo_src?: string
  logo_width?: number
  logo_height?: number
  logo_alt?: string | null
  copyright?: string | null
  catalog_default_sort_by?: string
  grid_per_page_values?: string
  list_per_page_values?: string
  grid_per_page: number
  list_per_page?: number
  list_mode?: string
  category_url_suffix?: string | null
  product_url_suffix?: string | null
  show_cms_breadcrumbs: boolean
}

export interface AvailableStore {
  id: number
  code: string
  store_code: string
  store_name: string
  store_sort_order: number
  is_default_store: boolean
  store_group_code: string
  store_group_name: string
  is_default_store_group: boolean
  website_id: number
  website_code: string
  website_name: string
  locale: string
  base_currency_code: string
  default_display_currency_code: string
  secure_base_url: string
  secure_base_link_url: string
  secure_base_media_url: string
}

export interface ExchangeRate {
  currency_to: string
  rate: number
}

export interface Currency {
  base_currency_code: string
  base_currency_symbol: string
  default_display_currency_code: string
  default_display_currency_symbol: string
  available_currency_codes: string[]
  exchange_rates: ExchangeRate[]
}

export interface StoreConfigResponse {
  storeConfig: StoreConfig
}

export interface AvailableStoresResponse {
  availableStores: AvailableStore[]
}

export interface CurrencyResponse {
  currency: Currency
}
