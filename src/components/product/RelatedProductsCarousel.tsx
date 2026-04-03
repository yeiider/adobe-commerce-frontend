'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { ProductCard } from '@/src/components/category/ProductCard'

interface RelatedProductsCarouselProps {
  products: any[]
  title?: string
}

export function RelatedProductsCarousel({ products, title = 'Productos Relacionados' }: RelatedProductsCarouselProps) {
  if (!products || products.length === 0) return null

  return (
    <div className="mt-16 w-full">
      <h3 className="mb-6 text-2xl font-semibold tracking-tight">{title}</h3>
      <div className="relative px-8 lg:px-12">
        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product, index) => (
              <CarouselItem key={product.uid || product.sku} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 xl:basis-1/5">
                <div className="p-1 h-full">
                  <ProductCard product={product} priority={index < 4} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 lg:-left-6" />
          <CarouselNext className="-right-4 lg:-right-6" />
        </Carousel>
      </div>
    </div>
  )
}
