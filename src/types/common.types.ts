/**
 * Common Types
 * Shared types used across the application
 */

export interface Money {
  value: number
  currency: string
}

export interface PageInfo {
  current_page: number
  page_size: number
  total_pages: number
}

export interface Aggregation {
  attribute_code: string
  count: number
  label: string
  options: AggregationOption[]
}

export interface AggregationOption {
  count: number
  label: string
  value: string
}

export interface SortOption {
  label: string
  value: string
}

export interface SortFields {
  default: string
  options: SortOption[]
}

export interface Breadcrumb {
  category_id: number
  category_uid?: string
  category_name: string
  category_level?: number
  category_url_key?: string
  category_url_path?: string
}

export interface Image {
  url: string
  label?: string
}

export interface Region {
  region_id: number
  code: string
  name?: string
  region?: string
}

export interface Country {
  id: string
  code: string
  label: string
}

export interface Address {
  firstname: string
  lastname: string
  company?: string
  street: string[]
  city: string
  region?: Region
  postcode: string
  country: Country
  telephone: string
}

export interface UserError {
  code: string
  message: string
}

export interface GraphQLError {
  message: string
  locations?: Array<{ line: number; column: number }>
  path?: string[]
  extensions?: Record<string, unknown>
}

export type StockStatus = 'IN_STOCK' | 'OUT_OF_STOCK'

export interface SEOMetadata {
  meta_title?: string
  meta_keywords?: string
  meta_description?: string
  canonical_url?: string
}

// Filter Types for Layered Navigation
export type FilterInputType = 
  | { eq: string }
  | { in: string[] }
  | { from: string; to: string }
  | { match: string }

export interface ProductAttributeFilterInput {
  category_id?: FilterInputType
  category_uid?: FilterInputType
  price?: { from: string; to: string }
  name?: { match: string }
  sku?: FilterInputType
  url_key?: FilterInputType
  [key: string]: FilterInputType | undefined
}

export interface ActiveFilter {
  attributeCode: string
  label: string
  value: string
  valueLabel: string
}

export interface FilterState {
  [attributeCode: string]: string | string[]
}

// Sort Types
export type SortDirection = 'ASC' | 'DESC'

export interface ProductAttributeSortInput {
  [field: string]: SortDirection
}
