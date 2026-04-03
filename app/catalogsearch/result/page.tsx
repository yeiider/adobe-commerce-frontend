import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'
import { StoreProvider } from '@/src/components/providers/StoreProvider'
import { getFullStoreContext } from '@/src/services/store.service'
import { searchProducts } from '@/src/services/search.service'
import { CategoryProductList } from '@/src/components/category/CategoryProductList'
import { FilterSidebar, ProductToolbar } from '@/src/components/filters'
import { SearchResultsHeader } from '@/src/components/search/SearchResultsHeader'
import { NoResults } from '@/src/components/search/NoResults'
import { SearchPagination } from '@/src/components/search/SearchPagination'
import { parseFiltersFromUrl, buildGraphQLFilter, parseSortParam } from '@/src/utils/filters'
import { config } from '@/src/config/env'

interface SearchResultsPageProps {
  searchParams: Promise<{
    q?: string
    page?: string
    sort?: string
    [key: string]: string | string[] | undefined
  }>
}

export async function generateMetadata({ searchParams }: SearchResultsPageProps): Promise<Metadata> {
  const { q } = await searchParams
  const query = q?.trim() || ''
  const siteName = config.seo.siteName

  if (!query) {
    return { title: `Búsqueda | ${siteName}` }
  }

  return {
    title: { absolute: `Resultados para "${query}" | ${siteName}` },
    description: `Encuentra los mejores productos para "${query}" en ${siteName}`,
    robots: { index: false, follow: true },
  }
}

export default async function SearchResultsPage({ searchParams }: SearchResultsPageProps) {
  const resolvedSearchParams = await searchParams
  const { q, page, sort, ...filterParams } = resolvedSearchParams

  const query = q?.trim() || ''

  const storeContext = await getFullStoreContext()
  const { storeConfig, currency, navigation } = storeContext

  if (!query) {
    return (
      <StoreProvider storeConfig={storeConfig} currency={currency}>
        <div className="flex min-h-screen flex-col">
          <Header navigation={navigation} />
          <main className="flex-1">
            <div className="container mx-auto px-4 py-16 text-center">
              <p className="text-2xl font-semibold text-foreground">Ingresa un término de búsqueda</p>
              <p className="mt-2 text-muted-foreground">Usa la barra de búsqueda para encontrar productos.</p>
              <Link href="/" className="mt-6 inline-block text-primary hover:underline">
                Volver al inicio
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </StoreProvider>
    )
  }

  const currentPage = page ? parseInt(page as string, 10) : 1
  const pageSize = 20
  const sortOptions = parseSortParam(sort as string)
  const filterState = parseFiltersFromUrl(filterParams as Record<string, string | string[]>)
  const graphqlFilter = buildGraphQLFilter(filterState)

  const products = await searchProducts({
    search: query,
    pageSize,
    currentPage,
    sort: sortOptions,
    filter: Object.keys(graphqlFilter).length > 0 ? graphqlFilter : undefined,
  })

  return (
    <StoreProvider storeConfig={storeConfig} currency={currency}>
      <div className="flex min-h-screen flex-col">
        <Header navigation={navigation} />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <SearchResultsHeader query={query} totalCount={products?.total_count ?? 0} />

            <div className="flex gap-8">
              {/* Desktop Filter Sidebar */}
              {products?.aggregations && products.aggregations.length > 0 && (
                <div className="hidden w-64 flex-shrink-0 lg:block">
                  <FilterSidebar aggregations={products.aggregations} />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <ProductToolbar
                  totalCount={products?.total_count ?? 0}
                  sortFields={products?.sort_fields}
                  filterContent={
                    products?.aggregations && products.aggregations.length > 0 ? (
                      <FilterSidebar aggregations={products.aggregations} />
                    ) : undefined
                  }
                  className="mb-6"
                />

                {products && products.items.length > 0 ? (
                  <>
                    <CategoryProductList products={products.items} />
                    {products.page_info.total_pages > 1 && (
                      <div className="mt-8">
                        <SearchPagination
                          query={query}
                          filterState={filterState}
                          sortParam={sort as string | undefined}
                          currentPage={products.page_info.current_page}
                          totalPages={products.page_info.total_pages}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <NoResults query={query} />
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
