/**
 * Category GraphQL Fragments
 * Reusable fragments for category-related queries
 */

export const CATEGORY_BASIC_FRAGMENT = /* GraphQL */ `
  fragment CategoryBasic on CategoryTree {
    id
    uid
    name
    url_key
    url_path
    level
    position
    include_in_menu
    is_anchor
  }
`

export const CATEGORY_SEO_FRAGMENT = /* GraphQL */ `
  fragment CategorySeo on CategoryTree {
    meta_title
    meta_keywords
    meta_description
    canonical_url
  }
`

export const CATEGORY_IMAGE_FRAGMENT = /* GraphQL */ `
  fragment CategoryImage on CategoryTree {
    image
  }
`

export const CATEGORY_BREADCRUMB_FRAGMENT = /* GraphQL */ `
  fragment CategoryBreadcrumb on CategoryTree {
    breadcrumbs {
      category_id
      category_uid
      category_name
      category_level
      category_url_key
      category_url_path
    }
  }
`

export const CATEGORY_TREE_FRAGMENT = /* GraphQL */ `
  fragment CategoryTree on CategoryTree {
    ...CategoryBasic
    ...CategoryImage
    children_count
    children {
      ...CategoryBasic
      ...CategoryImage
      children_count
      children {
        ...CategoryBasic
        ...CategoryImage
        children_count
        children {
          ...CategoryBasic
          ...CategoryImage
          children_count
        }
      }
    }
  }
`

export const CATEGORY_DETAILS_FRAGMENT = /* GraphQL */ `
  fragment CategoryDetails on CategoryTree {
    ...CategoryBasic
    ...CategorySeo
    ...CategoryImage
    ...CategoryBreadcrumb
    description
    display_mode
    landing_page
    cms_block {
      identifier
      title
      content
    }
    product_count
  }
`
