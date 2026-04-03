'use client'

import React, { useState } from 'react'
import { useCart } from '@/src/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Tag, X } from 'lucide-react'

export function CouponForm() {
  const { cart, applyCoupon, removeCoupon } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)

  const appliedCoupons = cart?.applied_coupons || []
  const hasCoupon = appliedCoupons.length > 0

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) return

    setIsApplying(true)
    const toastId = toast.loading('Aplicando cupón...')
    try {
      const success = await applyCoupon(couponCode.trim())
      if (success) {
        toast.success(`Cupón "${couponCode}" aplicado exitosamente.`, { id: toastId })
        setCouponCode('')
      } else {
        toast.error('El cupón ingresado no es válido o está vencido.', { id: toastId })
      }
    } catch {
      toast.error('Ocurrió un error al aplicar el cupón.', { id: toastId })
    } finally {
      setIsApplying(false)
    }
  }

  const handleRemove = async () => {
    setIsApplying(true)
    const toastId = toast.loading('Removiendo cupón...')
    try {
      const success = await removeCoupon()
      if (success) {
        toast.success('Cupón removido.', { id: toastId })
      } else {
        toast.error('Ocurrió un error al remover el cupón.', { id: toastId })
      }
    } catch {
      toast.error('Ocurrió un error al remover el cupón.', { id: toastId })
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm mt-6">
      <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2 mb-4">
        <Tag className="h-4 w-4" />
        Código de descuento
      </h3>
      
      {hasCoupon ? (
        <div className="space-y-4">
          {appliedCoupons.map((coupon, i) => (
            <div key={i} className="flex items-center justify-between rounded border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
              <span className="font-medium uppercase tracking-wider">{coupon.code}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={isApplying}
                className="h-auto p-1 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remover cupón</span>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <Input
            type="text"
            placeholder="Introduce tu cupón..."
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={isApplying}
            className="flex-1 uppercase"
          />
          <Button 
            type="submit" 
            variant="secondary" 
            disabled={!couponCode.trim() || isApplying}
          >
            Aplicar
          </Button>
        </form>
      )}
    </div>
  )
}
