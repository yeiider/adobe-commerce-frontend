/**
 * CMS Types
 * All CMS content TypeScript types for Adobe Commerce
 */

import { SEOMetadata } from './common.types'

export interface CmsPage extends SEOMetadata {
  identifier: string
  url_key: string
  title: string
  content: string
  content_heading?: string
  page_layout?: string
}

export interface CmsBlock {
  identifier: string
  title: string
  content: string
}

export interface CmsBlocksResponse {
  cmsBlocks: {
    items: CmsBlock[]
  }
}

export interface CmsPageResponse {
  cmsPage: CmsPage
}
