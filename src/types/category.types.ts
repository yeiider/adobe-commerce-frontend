/**
 * Category Types
 * All category-related TypeScript types for Adobe Commerce
 */

import { SEOMetadata, Breadcrumb } from './common.types'

export interface CategoryBasic extends SEOMetadata {
  id: number
  uid: string
  name: string
  url_key: string
  url_path: string
  level: number
  position: number
  include_in_menu: boolean
  is_anchor?: boolean
}

export interface CategoryImage {
  image?: string
}

export interface CmsBlock {
  identifier: string
  title: string
  content: string
}

export interface Category extends CategoryBasic, CategoryImage {
  children_count: number
  children?: Category[]
  breadcrumbs?: Breadcrumb[]
  description?: string
  display_mode?: string
  landing_page?: number
  cms_block?: CmsBlock
  product_count?: number
}

// Navigation Menu Types (Magento categoryList response)
export interface NavigationItem {
  id: number
  uid?: string
  name: string
  url_key: string | null
  url_path: string | null
  position: number
  include_in_menu?: boolean
  children_count: string | number
  children?: NavigationItem[]
}

export interface NavigationMenu {
  items: NavigationItem[]
}

// Category Tree Response (categories query)
export interface CategoryTreeResponse {
  categories: {
    items: Category[]
  }
}

// Category List Response (categoryList query - Magento specific)
export interface CategoryListResponse {
  categoryList: NavigationItem[]
}
