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

/**
 * Navigation Item - Used for building the navigation menu
 * Based on the optimized GetNavigationTreeCore query response
 */
export interface NavigationItem {
  name: string
  url_path: string | null
  children_count?: string | number
  children?: NavigationItem[]
}

/**
 * Root Category from categoryList response
 * The first element contains the root category (Default Category)
 * with children as the main navigation items
 */
export interface NavigationRootCategory {
  name: string
  url_path: string | null
  children: NavigationItem[]
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
  categoryList: NavigationRootCategory[]
}
