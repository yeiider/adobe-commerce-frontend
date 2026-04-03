'use client'

import type { Product } from '@/src/types/product.types'
import { ProductCard } from './ProductCard'

interface CategoryProductListProps {
  products: Product[]
}

export function CategoryProductList({ products }: CategoryProductListProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
      {products.map((product, index) => (
        <ProductCard 
          key={product.uid || product.sku} 
          product={product as any} 
          priority={index < 4} // First 4 images get priority loading
        />
      ))}
    </div>
  )
}
