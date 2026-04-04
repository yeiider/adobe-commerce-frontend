import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'
import { StoreProvider } from '@/src/components/providers/StoreProvider'
import { getFullStoreContext } from '@/src/services/store.service'
import { getCategoryByUrlPath } from '@/src/services/category.service'
import { getProductsByFilter, getFullProductDetails } from '@/src/services/product.service'
import { CategoryProductList } from '@/src/components/category/CategoryProductList'
import { CategoryPagination } from '@/src/components/category/CategoryPagination'
import { CategoryBreadcrumbs } from '@/src/components/category/CategoryBreadcrumbs'
import { FilterSidebar, ProductToolbar } from '@/src/components/filters'
import { parseFiltersFromUrl, buildGraphQLFilter, parseSortParam } from '@/src/utils/filters'
import { config } from '@/src/config/env'
import { ProductPageClient } from '@/src/components/product/ProductPageClient'
import { getStoryBySlug } from '@/src/services/storyblok.service'
import { StoryblokRenderer } from '@/src/components/storyblok/StoryblokRenderer'
import type { PageBlok } from '@/src/types/storyblok.types'

interface SlugPageProps {
  params: Promise<{
    slug: string[]
  }>
  searchParams: Promise<{
    page?: string
    sort?: string
    [key: string]: string | string[] | undefined
  }>
}

/**
 * Sanitize a Magento SEO field: returns null if the value is empty or the
 * literal string "null" (common when data is imported via CSV/DataPump).
 */
function sanitizeMagentoSeoField(value: string | null | undefined): string | null {
  if (!value || value.trim() === '' || value.trim().toLowerCase() === 'null') return null
  return value.trim()
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  let urlPath = slug.join('/')
  if (urlPath.endsWith('.html')) {
    urlPath = urlPath.replace('.html', '')
  }
  const siteName = config.seo.siteName
  const siteUrl = config.seo.siteUrl

  // Try Category first
  const category = await getCategoryByUrlPath(urlPath)

  if (category) {
    const metaTitle = sanitizeMagentoSeoField(category.meta_title)
    const metaDescription = sanitizeMagentoSeoField(category.meta_description)
    const metaKeywords = sanitizeMagentoSeoField(category.meta_keywords)

    const title = metaTitle || category.name
    const description = metaDescription || sanitizeMagentoSeoField(category.description) || `Explora los productos de ${category.name} en ${siteName}`
    const canonical = `${siteUrl}/${category.url_path || urlPath}`

    return {
      title: { absolute: `${title} | ${siteName}` },
      description,
      ...(metaKeywords && { keywords: metaKeywords.split(',').map(k => k.trim()) }),
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${siteUrl}/${urlPath}`,
        siteName,
        images: category.image ? [{ url: category.image, width: 1200, height: 630, alt: category.name }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: category.image ? [category.image] : undefined,
      },
      robots: { index: true, follow: true },
    }
  }

  // If not category, try Product
  const product = await getFullProductDetails(urlPath)

  if (product) {
    const title = product.name
    // Extract plain text from product description for meta
    const descriptionText = product.short_description?.html
      ? product.short_description.html.replace(/<[^>]+>/g, '').slice(0, 160)
      : `Compra ${product.name} en ${siteName}`
    
    const canonical = `${siteUrl}/${product.url_key || urlPath}`

    return {
      title: { absolute: `${title} | ${siteName}` },
      description: descriptionText,
      alternates: { canonical },
      openGraph: {
        title,
        description: descriptionText,
        type: 'website',
        url: `${siteUrl}/${urlPath}`,
        siteName,
        images: product.media_gallery?.[0]?.url ? [{ url: product.media_gallery[0].url, alt: title }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: descriptionText,
        images: product.media_gallery?.[0]?.url ? [product.media_gallery[0].url] : undefined,
      },
      robots: { index: true, follow: true },
    }
  }

  // 3. Try Storyblok CMS page
  const story = await getStoryBySlug<PageBlok>(urlPath)
  if (story) {
    const seoTitle = story.content?.seo_title
    const seoDescription = story.content?.seo_description
    return {
      title: seoTitle ? { absolute: `${seoTitle} | ${config.seo.siteName}` } : story.name,
      description: seoDescription || story.name,
      alternates: { canonical: `${config.seo.siteUrl}/${urlPath}` },
      robots: { index: true, follow: true },
    }
  }

  return {
    title: 'Página no encontrada',
    description: 'La clase o producto que buscas no existe.',
  }
}

export default async function SlugPage({ params, searchParams }: SlugPageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const { page, sort, ...filterParams } = resolvedSearchParams
  
  let urlPath = slug.join('/')
  if (urlPath.endsWith('.html')) {
    urlPath = urlPath.replace('.html', '')
  }
  
  const storeContext = await getFullStoreContext()
  const { storeConfig, currency, navigation } = storeContext

  // 1. Try resolving Category
  const category = await getCategoryByUrlPath(urlPath)

  if (category) {
    const currentPage = page ? parseInt(page as string, 10) : 1
    const pageSize = 20
    const sortOptions = parseSortParam(sort as string)
    const filterState = parseFiltersFromUrl(filterParams as Record<string, string | string[]>)
    const graphqlFilter = buildGraphQLFilter(filterState, category.id)
    
    const products = await getProductsByFilter({
      filter: graphqlFilter,
      pageSize,
      currentPage,
      sort: sortOptions,
    })

    return (
      <StoreProvider storeConfig={storeConfig} currency={currency}>
        <div className="flex min-h-screen flex-col">
          <Header navigation={navigation} />
          <main className="flex-1">
            <div className="container mx-auto px-4 py-8">
              <CategoryBreadcrumbs category={category} />

              <div className="mb-8">
                {category.image ? (
                  <div className="relative mb-6 h-48 w-full overflow-hidden rounded-lg md:h-64">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                        {category.name}
                      </h1>
                    </div>
                  </div>
                ) : (
                  <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                    {category.name}
                  </h1>
                )}
                {category.description && (
                  <p className="max-w-3xl text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </div>

              <div className="flex gap-8">
                {products?.aggregations && products.aggregations.length > 0 && (
                  <div className="hidden w-64 flex-shrink-0 lg:block">
                    <FilterSidebar 
                      aggregations={products.aggregations}
                      categoryId={category.id}
                    />
                  </div>
                )}

                <div className="flex-1">
                  <ProductToolbar
                    totalCount={products?.total_count || 0}
                    sortFields={products?.sort_fields}
                    filterContent={
                      products?.aggregations && products.aggregations.length > 0 ? (
                        <FilterSidebar aggregations={products.aggregations} categoryId={category.id} />
                      ) : undefined
                    }
                    className="mb-6"
                  />

                  {products && products.items.length > 0 ? (
                    <>
                      <CategoryProductList products={products.items} />
                      {products.page_info.total_pages > 1 && (
                        <div className="mt-8">
                          <CategoryPagination
                            currentPage={products.page_info.current_page}
                            totalPages={products.page_info.total_pages}
                            basePath={`/${urlPath}`}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <p className="text-lg text-muted-foreground">
                        No hay productos disponibles con los filtros seleccionados.
                      </p>
                      <Link href={`/${urlPath}`} className="mt-4 text-primary hover:underline">
                        Limpiar filtros
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </StoreProvider>
    )
  }

  // 2. Try resolving Product
  const product = await getFullProductDetails(urlPath)

  if (product) {
    return (
      <StoreProvider storeConfig={storeConfig} currency={currency}>
        <div className="flex min-h-screen flex-col">
          <Header navigation={navigation} />
          
          <main className="flex-1 bg-background pt-4 md:pt-6">
            <ProductPageClient product={product} />
          </main>
          
          <Footer />
        </div>
      </StoreProvider>
    )
  }

  // 3. Try Storyblok CMS page
  const story = await getStoryBySlug<PageBlok>(urlPath)

  if (story?.content?.body) {
    return (
      <StoreProvider storeConfig={storeConfig} currency={currency}>
        <div className="flex min-h-screen flex-col">
          <Header navigation={navigation} />
          <main className="flex-1">
            <StoryblokRenderer blocks={story.content.body} />
          </main>
          <Footer />
        </div>
      </StoreProvider>
    )
  }

  // 4. Fallback to 404
  notFound()
}
