/**
 * CMS GraphQL Fragments
 * Reusable fragments for CMS content queries
 */

export const CMS_PAGE_FRAGMENT = /* GraphQL */ `
  fragment CmsPage on CmsPage {
    identifier
    url_key
    title
    content
    content_heading
    page_layout
    meta_title
    meta_keywords
    meta_description
  }
`

export const CMS_BLOCK_FRAGMENT = /* GraphQL */ `
  fragment CmsBlock on CmsBlock {
    identifier
    title
    content
  }
`
