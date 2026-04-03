import type { Product } from '@/src/types/product.types'
import { CategoryProductList } from '@/src/components/category/CategoryProductList'

interface SearchResultsProps {
  products: Product[]
}

export function SearchResults({ products }: SearchResultsProps) {
  return <CategoryProductList products={products} />
}
