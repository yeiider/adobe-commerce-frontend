'use client'

import type { AggregationOption } from '@/src/types/common.types'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface FilterOptionProps {
  /** The option data */
  option: AggregationOption
  /** The attribute code this option belongs to */
  attributeCode: string
  /** Whether this option is currently active */
  isActive: boolean
  /** Handler for toggling this option */
  onToggle: (attributeCode: string, value: string) => void
  /** Display variant */
  variant?: 'checkbox' | 'swatch' | 'button'
}

/**
 * FilterOption - Individual filter option
 * 
 * Renders a single filter option with different variants:
 * - checkbox: Standard checkbox with label
 * - swatch: Color swatch circle
 * - button: Pill-style button
 * 
 * @example
 * <FilterOption
 *   option={{ label: 'Red', value: '49', count: 12 }}
 *   attributeCode="color"
 *   isActive={false}
 *   onToggle={(code, val) => handleToggle(code, val)}
 *   variant="swatch"
 * />
 */
export function FilterOption({
  option,
  attributeCode,
  isActive,
  onToggle,
  variant = 'checkbox',
}: FilterOptionProps) {
  const { label, value, count } = option

  const handleClick = () => {
    onToggle(attributeCode, value)
  }

  if (variant === 'swatch') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'group relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all',
          isActive
            ? 'border-primary ring-2 ring-primary ring-offset-2'
            : 'border-border hover:border-primary/50'
        )}
        title={`${label} (${count})`}
        aria-pressed={isActive}
      >
        {/* Color circle - try to detect if label is a color name */}
        <span
          className="h-5 w-5 rounded-full"
          style={{ backgroundColor: getColorFromLabel(label) }}
        />
        {isActive && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-3 w-3 text-primary-foreground drop-shadow-md"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
        )}
      </button>
    )
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
          isActive
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-background text-foreground hover:border-primary hover:bg-primary/10'
        )}
        aria-pressed={isActive}
      >
        {label}
        <span className="ml-1 text-muted-foreground">({count})</span>
      </button>
    )
  }

  // Default: checkbox variant
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50',
        isActive && 'bg-muted/50'
      )}
    >
      <Checkbox
        checked={isActive}
        onCheckedChange={handleClick}
        className="h-4 w-4"
      />
      <span className="flex-1 text-sm text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">({count})</span>
    </label>
  )
}

/**
 * Attempt to convert color label to CSS color
 * Maps common color names in Spanish/English to hex values
 */
function getColorFromLabel(label: string): string {
  const colorMap: Record<string, string> = {
    // English colors
    'black': '#000000',
    'white': '#FFFFFF',
    'red': '#EF4444',
    'blue': '#3B82F6',
    'green': '#22C55E',
    'yellow': '#EAB308',
    'orange': '#F97316',
    'purple': '#A855F7',
    'pink': '#EC4899',
    'gray': '#6B7280',
    'grey': '#6B7280',
    'brown': '#92400E',
    'navy': '#1E3A5F',
    'beige': '#F5F5DC',
    'gold': '#FFD700',
    'silver': '#C0C0C0',
    // Spanish colors
    'negro': '#000000',
    'blanco': '#FFFFFF',
    'rojo': '#EF4444',
    'azul': '#3B82F6',
    'verde': '#22C55E',
    'amarillo': '#EAB308',
    'naranja': '#F97316',
    'morado': '#A855F7',
    'rosa': '#EC4899',
    'gris': '#6B7280',
    'marrón': '#92400E',
    'marron': '#92400E',
    'café': '#92400E',
    'cafe': '#92400E',
    'dorado': '#FFD700',
    'plateado': '#C0C0C0',
  }

  const normalizedLabel = label.toLowerCase().trim()
  return colorMap[normalizedLabel] || '#9CA3AF' // Default gray
}
