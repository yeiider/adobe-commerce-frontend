'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface SwatchData {
  value?: string
  thumbnail?: string
}

interface OptionValue {
  value_index: number
  label: string
  swatch_data?: SwatchData | null
}

interface ConfigurableOption {
  attribute_code: string
  label: string
  values: OptionValue[]
}

interface VariantAttribute {
  code: string
  value_index: number
}

interface Variant {
  attributes: VariantAttribute[]
  product: {
    sku: string
    stock_status: string
    price_range?: {
      maximum_price?: {
        final_price?: {
          value: number
        }
      }
    }
  }
}

interface ProductOptionsProps {
  options: ConfigurableOption[]
  variants: Variant[]
  onVariantChange?: (variant: Variant | null) => void
  compact?: boolean
}

export function ProductOptions({ options, variants, onVariantChange, compact = false }: ProductOptionsProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({})

  const handleSelect = (attributeCode: string, valueIndex: number) => {
    const newSelection = {
      ...selectedOptions,
      [attributeCode]: valueIndex
    }
    
    // Toggle off if clicking the already selected option
    if (selectedOptions[attributeCode] === valueIndex) {
      delete newSelection[attributeCode]
    }
    
    setSelectedOptions(newSelection)

    // Check if we have a matched variant
    if (variants && onVariantChange) {
      // Find a variant that matches all currently selected options
      const matchedVariant = variants.find(variant => {
        // Every key in newSelection must match the variant's attributes
        return Object.entries(newSelection).every(([code, valIdx]) => {
          return variant.attributes.some(attr => attr.code === code && attr.value_index === valIdx)
        })
      })

      // If we have selected all required options and found a exact matching variant
      const isCompleteMatch = Object.keys(newSelection).length === options.length
      if (isCompleteMatch && matchedVariant) {
        onVariantChange(matchedVariant)
      } else {
        onVariantChange(null)
      }
    }
  }

  // Check if an option value is available based on other selections
  const isValueAvailable = (attributeCode: string, valueIndex: number) => {
    // If no variants exist, default to true
    if (!variants || variants.length === 0) return true
    
    const potentialSelection = { ...selectedOptions, [attributeCode]: valueIndex }
    
    return variants.some(variant => {
      // Must match potentialSelection AND have IN_STOCK status (or we ignore stock for display)
      return Object.entries(potentialSelection).every(([code, valIdx]) => 
        variant.attributes.some(attr => attr.code === code && attr.value_index === valIdx)
      ) && variant.product.stock_status !== 'OUT_OF_STOCK'
    })
  }

  if (!options || options.length === 0) return null

  return (
    <div className={cn("flex flex-col", compact ? "gap-3" : "gap-6")}>
      {options.map((option) => (
        <div key={option.attribute_code} className={cn("flex flex-col", compact ? "gap-1.5" : "gap-3")}>
          <div className="flex items-center justify-between">
            <span className={cn("font-medium text-foreground", compact ? "text-xs" : "text-sm")}>
              {option.label}
            </span>
            {selectedOptions[option.attribute_code] && (
              <span className="text-sm text-muted-foreground">
                {option.values.find(v => v.value_index === selectedOptions[option.attribute_code])?.label}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {option.values.map((val) => {
              const isSelected = selectedOptions[option.attribute_code] === val.value_index
              const available = isValueAvailable(option.attribute_code, val.value_index)
              const swatch = val.swatch_data

              // Color Swatch
              if (swatch?.value && swatch.value.startsWith('#')) {
                return (
                  <button
                    key={val.value_index}
                    type="button"
                    title={val.label}
                    aria-label={val.label}
                    disabled={!available}
                    onClick={() => handleSelect(option.attribute_code, val.value_index)}
                    className={cn(
                      "relative rounded-full border-2 transition-all hover:scale-110 focus:outline-none",
                      compact ? "h-6 w-6" : "h-10 w-10",
                      isSelected ? "border-primary ring-2 ring-primary ring-offset-1" : "border-border",
                      !available && "opacity-30 cursor-not-allowed after:absolute after:left-1/2 after:top-1/2 after:h-[2px] after:w-full after:-translate-x-1/2 after:-translate-y-1/2 after:-rotate-45 after:bg-destructive"
                    )}
                    style={{ backgroundColor: swatch.value }}
                  />
                )
              }

              // Image Swatch
              if (swatch?.thumbnail) {
                return (
                  <button
                    key={val.value_index}
                    type="button"
                    title={val.label}
                    aria-label={val.label}
                    disabled={!available}
                    onClick={() => handleSelect(option.attribute_code, val.value_index)}
                    className={cn(
                      "relative overflow-hidden rounded-md border-2 transition-all hover:scale-105",
                      compact ? "h-8 w-8" : "h-12 w-12",
                      isSelected ? "border-primary ring-2 ring-primary ring-offset-1" : "border-border",
                      !available && "opacity-30 cursor-not-allowed"
                    )}
                  >
                    <Image src={swatch.thumbnail} fill sizes="48px" alt={val.label} className="object-cover" />
                  </button>
                )
              }

              // Text Swatch or Fallback Button
              return (
                <button
                  key={val.value_index}
                  type="button"
                  disabled={!available}
                  onClick={() => handleSelect(option.attribute_code, val.value_index)}
                  className={cn(
                    "flex items-center justify-center rounded-md border transition-all",
                    compact ? "h-6 min-w-[2rem] px-2 text-[10px]" : "h-10 min-w-[3rem] px-3 text-sm",
                    isSelected 
                      ? "border-primary bg-primary text-primary-foreground font-semibold" 
                      : "border-input bg-background hover:bg-accent hover:text-accent-foreground",
                    !available && "opacity-40 cursor-not-allowed border-dashed bg-muted line-through"
                  )}
                >
                  {swatch?.value || val.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
