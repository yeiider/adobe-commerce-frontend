'use client'

import { Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchButtonProps {
  isLoading?: boolean
  disabled?: boolean
  label?: string
  className?: string
  onClick?: () => void
  type?: 'submit' | 'button'
}

export function SearchButton({
  isLoading,
  disabled,
  label = 'Buscar',
  className,
  onClick,
  type = 'submit',
}: SearchButtonProps) {
  return (
    <Button
      type={type}
      disabled={disabled || isLoading}
      className={cn('h-12 gap-2', className)}
      onClick={onClick}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Search className="h-4 w-4" />
      )}
      <span>{label}</span>
    </Button>
  )
}
