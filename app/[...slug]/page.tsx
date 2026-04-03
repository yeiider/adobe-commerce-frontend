import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'
import { StoreProvider } from '@/src/components/providers/StoreProvider'
import { getFullStoreContext } from '@/src/services/store.service'
import { getCategoryByUrlPath } from '@/src/services/category.service'
import { getProductsByFilter } from '@/src/services/product.service'
import { CategoryProductList } from '@/src/components/category/CategoryProductList'
import { CategoryPagination } from '@/src/components/category/CategoryPagination'
import { CategoryBreadcrumbs } from '@/src/components/category/CategoryBreadcrumbs'
import { FilterSidebar, ProductToolbar } from '@/src/components/filters'
import { parseFiltersFromUrl, buildGraphQLFilter, parseSortParam } from '@/src/utils/filters'
import { config } from '@/src/config/env'

interface CategoryPageProps {
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
 * Generate dynamic metadata for category SEO
 */
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const urlPath = slug.join('/')
  
  const category = await getCategoryByUrlPath(urlPath)

  if (!category) {
    return {
      title: 'Categoria no encontrada',
      description: 'La categoria que buscas no existe.',
    }
  }

  const siteName = config.seo.siteName
  const siteUrl = config.seo.siteUrl

  return {
    title: category.meta_title || `${category.name} | ${siteName}`,
    description: category.meta_description || category.description || `Explora los productos de ${category.name} en ${siteName}`,
    keywords: category.meta_keywords?.split(',').map(k => k.trim()) || [category.name],
    alternates: {
      canonical: category.canonical_url || `${siteUrl}/${urlPath}`,
    },
    openGraph: {
      title: category.meta_title || category.name,
      description: category.meta_description || category.description || `Productos de ${category.name}`,
      type: 'website',
      url: `${siteUrl}/${urlPath}`,
      siteName: siteName,
      images: category.image ? [
        {
          url: category.image,
          width: 1200,
          height: 630,
          alt: category.name,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: category.meta_title || category.name,
      description: category.meta_description || category.description || `Productos de ${category.name}`,
      images: category.image ? [category.image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const { page, sort, ...filterParams } = resolvedSearchParams
  
  // Construct URL path from slug segments
  const urlPath = slug.join('/')
  const currentPage = page ? parseInt(page as string, 10) : 1
  const pageSize = 20

  // Parse sort parameter
  const sortOptions = parseSortParam(sort as string)
  
  // Parse filter params from URL
  const filterState = parseFiltersFromUrl(filterParams as Record<string, string | string[]>)

  // Fetch category and store context first
  const [category, storeContext] = await Promise.all([
    getCategoryByUrlPath(urlPath),
    getFullStoreContext(),
  ])

  // If category not found, return 404
  if (!category) {
    notFound()
  }

  // Build GraphQL filter with category ID (using numeric id for category_id filter)
  const graphqlFilter = buildGraphQLFilter(filterState, category.id)

  // Fetch products with filters
  const products = await getProductsByFilter({
    filter: graphqlFilter,
    pageSize,
    currentPage,
    sort: sortOptions,
  })

  const { storeConfig, currency, navigation } = storeContext

  return (
    <StoreProvider storeConfig={storeConfig} currency={currency}>
      <div className="flex min-h-screen flex-col">
        <Header navigation={navigation} />
        
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <CategoryBreadcrumbs category={category} />

            {/* Category Header */}
            <div className="mb-8">
              {category.image && (
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
              )}
              
              {!category.image && (
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

            {/* Main Content with Sidebar */}
            <div className="flex gap-8">
              {/* Filter Sidebar - Desktop */}
              {products?.aggregations && products.aggregations.length > 0 && (
                <div className="hidden w-64 flex-shrink-0 lg:block">
                  <FilterSidebar 
                    aggregations={products.aggregations}
                    categoryId={category.id}
                  />
                </div>
              )}

              {/* Products Section */}
              <div className="flex-1">
                {/* Toolbar */}
                <ProductToolbar
                  totalCount={products?.total_count || 0}
                  sortFields={products?.sort_fields}
                  filterContent={
                    products?.aggregations && products.aggregations.length > 0 ? (
                      <FilterSidebar 
                        aggregations={products.aggregations}
                        categoryId={category.id}
                      />
                    ) : undefined
                  }
                  className="mb-6"
                />

                {/* Products Grid */}
                {products && products.items.length > 0 ? (
                  <>
                    <CategoryProductList products={products.items} />
                    
                    {/* Pagination */}
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
                    <Link
                      href={`/${urlPath}`}
                      className="mt-4 text-primary hover:underline"
                    >
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
