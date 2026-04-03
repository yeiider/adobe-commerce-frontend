'use client'

import { cn } from '@/lib/utils'
import type { ConfigurableOption, ConfigurableOptionValue, SwatchData } from '@/src/types/product.types'

interface ConfigurableOptionsProps {
  options: ConfigurableOption[]
  compact?: boolean
  maxVisible?: number
  onOptionSelect?: (attributeCode: string, valueIndex: number) => void
  selectedValues?: Record<string, number>
}

export function ConfigurableOptions({
  options,
  compact = true,
  maxVisible = 4,
  onOptionSelect,
  selectedValues = {},
}: ConfigurableOptionsProps) {
  if (!options || options.length === 0) return null

  // Sort options by position
  const sortedOptions = [...options].sort((a, b) => a.position - b.position)

  return (
    <div className="flex flex-col gap-2">
      {sortedOptions.map((option) => (
        <OptionGroup
          key={option.uid}
          option={option}
          compact={compact}
          maxVisible={maxVisible}
          onSelect={onOptionSelect}
          selectedValue={selectedValues[option.attribute_code]}
        />
      ))}
    </div>
  )
}

interface OptionGroupProps {
  option: ConfigurableOption
  compact: boolean
  maxVisible: number
  onSelect?: (attributeCode: string, valueIndex: number) => void
  selectedValue?: number
}

function OptionGroup({ option, compact, maxVisible, onSelect, selectedValue }: OptionGroupProps) {
  const { attribute_code, label, values } = option
  const visibleValues = compact ? values.slice(0, maxVisible) : values
  const hiddenCount = values.length - visibleValues.length

  // Determine if this option uses color swatches
  const hasColorSwatches = values.some((v) => isColorSwatch(v.swatch_data))

  return (
    <div className="flex flex-col gap-1">
      {!compact && (
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      )}
      <div className="flex flex-wrap items-center gap-1">
        {visibleValues.map((value) => (
          <OptionSwatch
            key={value.uid}
            value={value}
            isColor={hasColorSwatches}
            isSelected={selectedValue === value.value_index}
            onClick={() => onSelect?.(attribute_code, value.value_index)}
          />
        ))}
        {hiddenCount > 0 && (
          <span className="text-xs text-muted-foreground">+{hiddenCount}</span>
        )}
      </div>
    </div>
  )
}

interface OptionSwatchProps {
  value: ConfigurableOptionValue
  isColor: boolean
  isSelected: boolean
  onClick?: () => void
}

function OptionSwatch({ value, isColor, isSelected, onClick }: OptionSwatchProps) {
  const { label, swatch_data } = value

  // Color swatch
  if (isColor && swatch_data && isColorSwatch(swatch_data)) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={label}
        className={cn(
          'h-5 w-5 rounded-full border-2 transition-all hover:scale-110',
          isSelected ? 'border-primary ring-2 ring-primary ring-offset-1' : 'border-border'
        )}
        style={{ backgroundColor: swatch_data.value }}
        aria-label={label}
      />
    )
  }

  // Image swatch
  if (swatch_data && isImageSwatch(swatch_data)) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={label}
        className={cn(
          'h-6 w-6 overflow-hidden rounded border-2 transition-all hover:scale-110',
          isSelected ? 'border-primary ring-2 ring-primary ring-offset-1' : 'border-border'
        )}
        aria-label={label}
      >
        <img
          src={swatch_data.thumbnail}
          alt={label}
          className="h-full w-full object-cover"
        />
      </button>
    )
  }

  // Text swatch (size, etc.)
  const textValue = swatch_data && isTextSwatch(swatch_data) ? swatch_data.value : label
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded border px-2 py-0.5 text-xs font-medium transition-colors',
        isSelected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-foreground hover:border-primary hover:bg-accent'
      )}
      aria-label={label}
    >
      {textValue}
    </button>
  )
}

// Type guards for swatch data
function isColorSwatch(swatch: SwatchData | null | undefined): swatch is { value: string } {
  if (!swatch) return false
  if ('__typename' in swatch && swatch.__typename === 'ColorSwatchData') return true
  // Check if value looks like a hex color
  if ('value' in swatch && typeof swatch.value === 'string') {
    return /^#[0-9A-Fa-f]{3,6}$/.test(swatch.value)
  }
  return false
}

function isTextSwatch(swatch: SwatchData | null | undefined): swatch is { value: string } {
  if (!swatch) return false
  if ('__typename' in swatch && swatch.__typename === 'TextSwatchData') return true
  if ('value' in swatch && typeof swatch.value === 'string' && !isColorSwatch(swatch)) {
    return true
  }
  return false
}

function isImageSwatch(swatch: SwatchData | null | undefined): swatch is { thumbnail: string } {
  if (!swatch) return false
  if ('__typename' in swatch && swatch.__typename === 'ImageSwatchData') return true
  return 'thumbnail' in swatch && typeof swatch.thumbnail === 'string'
}
