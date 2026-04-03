/**
 * Product Types
 * All product-related TypeScript types for Adobe Commerce
 */

import { Money, Image, Breadcrumb, StockStatus, SEOMetadata, PageInfo, Aggregation, SortFields } from './common.types'
import { CategoryBasic } from './category.types'

// Price Types
export interface PriceDiscount {
  amount_off: number
  percent_off: number
}

export interface ProductPrice {
  regular_price: Money
  final_price: Money
  discount?: PriceDiscount
}

export interface PriceRange {
  minimum_price: ProductPrice
  maximum_price?: ProductPrice
}

// Media Types
export interface ProductVideo {
  media_type: string
  video_provider: string
  video_url: string
  video_title: string
  video_description: string
}

export interface MediaGalleryItem extends Image {
  position: number
  disabled: boolean
  video_content?: ProductVideo
}

// Product Types
export type ProductType = 'SimpleProduct' | 'ConfigurableProduct' | 'BundleProduct' | 'GroupedProduct' | 'VirtualProduct' | 'DownloadableProduct'

export interface ProductBasic extends SEOMetadata {
  id: number
  uid: string
  sku: string
  name: string
  url_key: string
  url_suffix?: string
  stock_status: StockStatus
  __typename: ProductType
}

export interface ProductImages {
  image?: Image
  small_image?: Image
  thumbnail?: Image
  media_gallery?: MediaGalleryItem[]
}

export interface ProductDescription {
  html: string
}

export interface Product extends ProductBasic, ProductImages {
  price_range: PriceRange
  description?: ProductDescription
  short_description?: ProductDescription
  categories?: CategoryBasic[]
  review_count?: number
  rating_summary?: number
  related_products?: ProductBasic[]
  upsell_products?: ProductBasic[]
  crosssell_products?: ProductBasic[]
}

// Configurable Product Types - Swatch Types
export interface ColorSwatchData {
  __typename?: 'ColorSwatchData'
  value: string // Hex color code, e.g., "#FF0000"
}

export interface TextSwatchData {
  __typename?: 'TextSwatchData'
  value: string // Text value, e.g., "XL"
}

export interface ImageSwatchData {
  __typename?: 'ImageSwatchData'
  thumbnail: string // URL of the swatch image
}

export type SwatchData = ColorSwatchData | TextSwatchData | ImageSwatchData | {
  value?: string
  thumbnail?: string
}

export interface ConfigurableOptionValue {
  uid: string
  value_index: number
  label: string
  swatch_data?: SwatchData | null
}

export interface ConfigurableOption {
  id: number
  uid: string
  attribute_id: string
  attribute_code: string
  label: string
  position: number
  values: ConfigurableOptionValue[]
}

export interface ConfigurableVariantAttribute {
  uid: string
  code: string
  value_index: number
  label: string
}

export interface ConfigurableVariant {
  attributes: ConfigurableVariantAttribute[]
  product: Product
}

export interface ConfigurableProduct extends Product {
  configurable_options: ConfigurableOption[]
  variants: ConfigurableVariant[]
}

// Bundle Product Types
export interface BundleOptionValue {
  uid: string
  quantity: number
  position: number
  is_default: boolean
  price: number
  price_type: string
  can_change_quantity: boolean
  label: string
  product: ProductBasic
}

export interface BundleOption {
  uid: string
  title: string
  required: boolean
  type: string
  position: number
  sku: string
  options: BundleOptionValue[]
}

export interface BundleProduct extends Product {
  dynamic_sku: boolean
  dynamic_price: boolean
  dynamic_weight: boolean
  price_view: string
  ship_bundle_items: string
  items: BundleOption[]
}

// Grouped Product Types
export interface GroupedProductItem {
  qty: number
  position: number
  product: Product
}

export interface GroupedProduct extends Product {
  items: GroupedProductItem[]
}

// Review Types
export interface ReviewRating {
  name: string
  value: string
}

export interface ProductReview {
  summary: string
  text: string
  nickname: string
  created_at: string
  average_rating: number
  ratings_breakdown: ReviewRating[]
}

export interface ProductReviews {
  items: ProductReview[]
  page_info: PageInfo
}

// Product List Response
export interface ProductsResponse {
  total_count: number
  page_info: PageInfo
  aggregations?: Aggregation[]
  sort_fields?: SortFields
  items: Product[]
}

// Search Suggestion
export interface SearchSuggestion {
  search: string
}
