/**
 * Environment Configuration
 * Centralized environment variables for Adobe Commerce integration
 */

export const config = {
  // Adobe Commerce API Configuration
  adobe: {
    /** GraphQL endpoint URL */
    graphqlEndpoint: process.env.NEXT_PUBLIC_ADOBE_COMMERCE_GRAPHQL_URL || '',
    /** Store code (website level) */
    storeCode: process.env.NEXT_PUBLIC_ADOBE_COMMERCE_STORE_CODE || 'default',
    /** Store view code (determines language, catalog) - sent as "Store" header */
    storeViewCode: process.env.NEXT_PUBLIC_ADOBE_COMMERCE_STORE_VIEW_CODE || 'default',
    /** Default currency code - sent as "Content-Currency" header */
    currencyCode: process.env.NEXT_PUBLIC_ADOBE_COMMERCE_CURRENCY_CODE || 'COP',
    /** Locale for formatting (e.g., es_CO, en_US) */
    locale: process.env.NEXT_PUBLIC_ADOBE_COMMERCE_LOCALE || 'es_CO',
    /** Website ID (optional, for multi-website setups) */
    websiteId: process.env.NEXT_PUBLIC_ADOBE_COMMERCE_WEBSITE_ID || '1',
    /** Root category ID (fetched from storeConfig, this is a fallback) */
    defaultRootCategoryId: process.env.NEXT_PUBLIC_ADOBE_COMMERCE_ROOT_CATEGORY_ID || '2',
  },

  // Authentication
  auth: {
    customerTokenKey: 'adobe_commerce_customer_token',
    cartIdKey: 'adobe_commerce_cart_id',
  },

  // Cache Configuration
  cache: {
    revalidateTime: Number(process.env.NEXT_PUBLIC_REVALIDATE_TIME) || 3600,
    staleWhileRevalidate: Number(process.env.NEXT_PUBLIC_SWR_TIME) || 60,
  },

  // Feature Flags
  features: {
    enableWishlist: process.env.NEXT_PUBLIC_ENABLE_WISHLIST === 'true',
    enableCompare: process.env.NEXT_PUBLIC_ENABLE_COMPARE === 'true',
    enableReviews: process.env.NEXT_PUBLIC_ENABLE_REVIEWS === 'true',
    enableMultiCurrency: process.env.NEXT_PUBLIC_ENABLE_MULTI_CURRENCY === 'true',
    enableMultiLanguage: process.env.NEXT_PUBLIC_ENABLE_MULTI_LANGUAGE === 'true',
  },

  // SEO Configuration
  seo: {
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Adobe Commerce Store',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
    defaultTitle: process.env.NEXT_PUBLIC_DEFAULT_TITLE || 'Adobe Commerce Store',
    defaultDescription: process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION || '',
    twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '',
  },

  // Image Configuration
  images: {
    baseUrl: process.env.NEXT_PUBLIC_ADOBE_COMMERCE_MEDIA_URL || '',
    placeholderUrl: '/images/placeholder.png',
    quality: 80,
  },
} as const

export type Config = typeof config
