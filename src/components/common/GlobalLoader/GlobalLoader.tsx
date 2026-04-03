'use client'

/**
 * GlobalLoader Component
 * 
 * A spectacular full-screen loader for global loading states.
 * Features:
 * - Animated progress bar at the top
 * - Pulsing logo/icon in center
 * - Smooth fade transitions
 * - Customizable appearance via props
 * 
 * @example
 * // Basic usage (controlled by LoadingProvider)
 * <GlobalLoader />
 * 
 * // Direct usage with props
 * <GlobalLoader isVisible={true} message="Cargando productos..." />
 */

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface GlobalLoaderProps {
  /** Whether the loader is visible */
  isVisible?: boolean
  /** Optional message to display */
  message?: string
  /** Custom className for the container */
  className?: string
  /** Show progress bar at top */
  showProgressBar?: boolean
  /** Progress value (0-100), if not provided, animates indefinitely */
  progress?: number
  /** Variant style */
  variant?: 'default' | 'minimal' | 'branded'
  /** Backdrop blur intensity */
  blur?: 'none' | 'sm' | 'md' | 'lg'
  /** Backdrop opacity */
  backdropOpacity?: 'light' | 'medium' | 'heavy'
}

export function GlobalLoader({
  isVisible = false,
  message,
  className,
  showProgressBar = true,
  progress,
  variant = 'default',
  blur = 'sm',
  backdropOpacity = 'medium',
}: GlobalLoaderProps) {
  const [mounted, setMounted] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  // Handle mount/unmount animation
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      // Small delay to trigger enter animation
      const timer = setTimeout(() => setMounted(true), 10)
      return () => clearTimeout(timer)
    } else {
      setMounted(false)
      // Wait for exit animation before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  if (!shouldRender) return null

  const blurClasses = {
    none: '',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  }

  const opacityClasses = {
    light: 'bg-background/60',
    medium: 'bg-background/80',
    heavy: 'bg-background/95',
  }

  return (
    <div
      role="progressbar"
      aria-busy={isVisible}
      aria-label={message || 'Cargando contenido'}
      className={cn(
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center',
        'transition-opacity duration-300 ease-out',
        blurClasses[blur],
        opacityClasses[backdropOpacity],
        mounted ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {/* Progress Bar at Top */}
      {showProgressBar && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted overflow-hidden">
          <div
            className={cn(
              'h-full bg-primary transition-all duration-300 ease-out',
              progress === undefined && 'animate-progress-indeterminate'
            )}
            style={progress !== undefined ? { width: `${progress}%` } : undefined}
          />
        </div>
      )}

      {/* Center Content */}
      <div className="flex flex-col items-center gap-6">
        {/* Loader Animation */}
        {variant === 'default' && <DefaultLoader />}
        {variant === 'minimal' && <MinimalLoader />}
        {variant === 'branded' && <BrandedLoader />}

        {/* Message */}
        {message && (
          <p className="text-sm text-muted-foreground animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Default Loader - Elegant spinning rings
 */
function DefaultLoader() {
  return (
    <div className="relative w-16 h-16">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-muted" />
      {/* Spinning ring */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      {/* Inner pulsing dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
      </div>
    </div>
  )
}

/**
 * Minimal Loader - Simple dots animation
 */
function MinimalLoader() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: '600ms',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Branded Loader - Store-themed loader with shopping bag icon
 */
function BrandedLoader() {
  return (
    <div className="relative">
      {/* Shopping bag icon */}
      <div className="relative w-14 h-16 flex flex-col items-center animate-bounce-gentle">
        {/* Bag handles */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-4">
          <div className="absolute left-0 w-2 h-4 border-2 border-primary rounded-t-full border-b-0" />
          <div className="absolute right-0 w-2 h-4 border-2 border-primary rounded-t-full border-b-0" />
        </div>
        {/* Bag body */}
        <div className="mt-3 w-12 h-12 rounded-b-lg bg-primary/10 border-2 border-primary flex items-center justify-center">
          {/* Inner pulsing circle */}
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
      {/* Loading shimmer effect */}
      <div className="absolute inset-0 -m-2 rounded-xl bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer" />
    </div>
  )
}

export default GlobalLoader
