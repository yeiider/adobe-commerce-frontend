'use client'

import { useState } from 'react'
import { Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import type { PaymentMethodInput } from '@/src/types/checkout.types'

interface AvailablePaymentMethod {
  code: string
  title: string
}

interface Props {
  availableMethods: AvailablePaymentMethod[]
  onSave: (method: PaymentMethodInput) => Promise<boolean>
  isProcessing: boolean
  isActive: boolean
  isCompleted: boolean
  completedMethod?: PaymentMethodInput
}

export function PaymentMethodStep({
  availableMethods,
  onSave,
  isProcessing,
  isActive,
  isCompleted,
  completedMethod,
}: Props) {
  const [selectedCode, setSelectedCode] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCode) return
    await onSave({ code: selectedCode })
  }

  if (!isActive && !isCompleted) return null

  if (isCompleted && completedMethod) {
    const selected = availableMethods.find((m) => m.code === completedMethod.code)
    return (
      <div className="rounded-md border p-4 bg-muted/30 flex items-center justify-between">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            Método de Pago
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {selected?.title || completedMethod.code}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border p-6 bg-card shadow-sm">
      <h3 className="text-lg font-medium mb-4">Método de Pago</h3>
      
      {availableMethods.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay métodos de pago disponibles.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup value={selectedCode} onValueChange={setSelectedCode}>
            <div className="space-y-3">
              {availableMethods.map((method) => (
                <div key={method.code} className="flex items-center space-x-3 rounded-md border p-4">
                  <RadioGroupItem value={method.code} id={method.code} />
                  <Label htmlFor={method.code} className="flex flex-1 items-center justify-between cursor-pointer">
                    <span className="font-medium">{method.title}</span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <Button type="submit" disabled={!selectedCode || isProcessing} className="w-full">
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirmar Método de Pago'}
          </Button>
        </form>
      )}
    </div>
  )
}
