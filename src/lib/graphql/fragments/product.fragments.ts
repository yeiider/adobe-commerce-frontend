/**
 * Product GraphQL Fragments
 * Reusable fragments for product-related queries
 */

export const PRODUCT_PRICE_FRAGMENT = /* GraphQL */ `
  fragment ProductPrice on ProductInterface {
    price_range {
      minimum_price {
        regular_price {
          value
          currency
        }
        final_price {
          value
          currency
        }
        discount {
          amount_off
          percent_off
        }
      }
      maximum_price {
        regular_price {
          value
          currency
        }
        final_price {
          value
          currency
        }
      }
    }
  }
`

export const PRODUCT_IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ProductImage on ProductInterface {
    image {
      url
      label
    }
    small_image {
      url
      label
    }
    thumbnail {
      url
      label
    }
    media_gallery {
      url
      label
      position
      disabled
      ... on ProductVideo {
        video_content {
          media_type
          video_provider
          video_url
          video_title
          video_description
        }
      }
    }
  }
`

export const PRODUCT_SEO_FRAGMENT = /* GraphQL */ `
  fragment ProductSeo on ProductInterface {
    meta_title
    meta_keyword
    meta_description
    canonical_url
  }
`

export const PRODUCT_BASIC_FRAGMENT = /* GraphQL */ `
  fragment ProductBasic on ProductInterface {
    id
    uid
    sku
    name
    url_key
    url_suffix
    stock_status
    __typename
  }
`

export const PRODUCT_DETAILS_FRAGMENT = /* GraphQL */ `
  fragment ProductDetails on ProductInterface {
    ...ProductBasic
    ...ProductPrice
    ...ProductImage
    ...ProductSeo
    description {
      html
    }
    short_description {
      html
    }
    categories {
      id
      uid
      name
      url_key
      url_path
      breadcrumbs {
        category_id
        category_name
        category_url_key
      }
    }
    related_products {
      ...ProductBasic
      ...ProductPrice
      ...ProductImage
    }
    upsell_products {
      ...ProductBasic
      ...ProductPrice
      ...ProductImage
    }
    crosssell_products {
      ...ProductBasic
      ...ProductPrice
      ...ProductImage
    }
  }
`

export const CONFIGURABLE_PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ConfigurableProduct on ConfigurableProduct {
    configurable_options {
      id
      uid
      attribute_id
      attribute_code
      label
      position
      values {
        uid
        value_index
        label
        swatch_data {
          value
          ... on ImageSwatchData {
            thumbnail
          }
          ... on ColorSwatchData {
            value
          }
          ... on TextSwatchData {
            value
          }
        }
      }
    }
    variants {
      attributes {
        uid
        code
        value_index
        label
      }
      product {
        ...ProductBasic
        ...ProductPrice
        ...ProductImage
      }
    }
  }
`

export const BUNDLE_PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment BundleProduct on BundleProduct {
    dynamic_sku
    dynamic_price
    dynamic_weight
    price_view
    ship_bundle_items
    items {
      uid
      title
      required
      type
      position
      sku
      options {
        uid
        quantity
        position
        is_default
        price
        price_type
        can_change_quantity
        label
        product {
          ...ProductBasic
          ...ProductPrice
        }
      }
    }
  }
`

export const GROUPED_PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment GroupedProduct on GroupedProduct {
    items {
      qty
      position
      product {
        ...ProductBasic
        ...ProductPrice
        ...ProductImage
      }
    }
  }
`
