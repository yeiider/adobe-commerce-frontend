'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn } from '@/lib/utils'

interface MediaGalleryItem {
  url: string
  label: string | null
  position: number
}

interface ProductGalleryProps {
  mediaGallery: MediaGalleryItem[]
  name: string
}

export function ProductGallery({ mediaGallery, name }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(
    mediaGallery.length > 0 ? mediaGallery[0] : null
  )

  if (!mediaGallery || mediaGallery.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-muted">
        <span className="text-muted-foreground">Sin imágenes</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Active Image */}
      <div className="relative overflow-hidden rounded-lg bg-white border">
        <AspectRatio ratio={1}>
          <Image
            src={activeImage?.url || mediaGallery[0].url}
            alt={activeImage?.label || name}
            fill
            className="object-contain p-4 transition-all duration-500 hover:scale-105"
            priority
          />
        </AspectRatio>
      </div>

      {/* Thumbnails Carousel */}
      {mediaGallery.length > 1 && (
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {mediaGallery.map((media, index) => (
              <CarouselItem key={index} className="pl-2 basis-1/4 sm:basis-1/5 md:basis-1/4 lg:basis-1/5">
                <button
                  type="button"
                  onClick={() => setActiveImage(media)}
                  className={cn(
                    "relative flex aspect-square w-full overflow-hidden rounded-md border-2 bg-white transition-all",
                    activeImage?.url === media.url
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={media.url}
                    alt={media.label || `${name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      )}
    </div>
  )
}
