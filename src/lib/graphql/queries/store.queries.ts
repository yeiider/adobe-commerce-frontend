/**
 * Store GraphQL Queries
 * All store configuration queries for Adobe Commerce
 */

export const GET_STORE_CONFIG = /* GraphQL */ `
  query GetStoreConfig {
    storeConfig {
      id
      code
      website_id
      locale
      base_currency_code
      default_display_currency_code
      timezone
      weight_unit
      base_url
      base_link_url
      base_static_url
      base_media_url
      secure_base_url
      secure_base_link_url
      secure_base_static_url
      secure_base_media_url
      store_name
      store_group_name
      store_sort_order
      root_category_id
      root_category_uid
      default_title
      default_keywords
      default_description
      head_shortcut_icon
      header_logo_src
      logo_width
      logo_height
      copyright
      catalog_default_sort_by
      grid_per_page_values
      list_per_page_values
      grid_per_page
      list_per_page
      list_mode
      category_url_suffix
      product_url_suffix
      show_cms_breadcrumbs
    }
  }
`

export const GET_AVAILABLE_STORES = /* GraphQL */ `
  query GetAvailableStores {
    availableStores {
      id
      code
      store_code
      store_name
      store_sort_order
      is_default_store
      store_group_code
      store_group_name
      is_default_store_group
      website_id
      website_code
      website_name
      locale
      base_currency_code
      default_display_currency_code
      secure_base_url
      secure_base_link_url
      secure_base_media_url
    }
  }
`

export const GET_CURRENCY = /* GraphQL */ `
  query GetCurrency {
    currency {
      base_currency_code
      base_currency_symbol
      default_display_currency_code
      default_display_currency_symbol
      available_currency_codes
      exchange_rates {
        currency_to
        rate
      }
    }
  }
`
