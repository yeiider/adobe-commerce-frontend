/**
 * Loading Component
 * 
 * A simple inline loading spinner for use in components.
 * For full-screen loading, use GlobalLoader instead.
 */

import { cn } from '@/lib/utils'

export interface LoadingProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Additional class names */
  className?: string
  /** Loading message */
  message?: string
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
}

export function Loading({ size = 'md', className, message }: LoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full border-muted border-t-primary animate-spin',
          sizeClasses[size]
        )}
        role="status"
        aria-label={message || 'Cargando'}
      />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
      <span className="sr-only">{message || 'Cargando...'}</span>
    </div>
  )
}

export default Loading
