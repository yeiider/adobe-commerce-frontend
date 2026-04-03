'use client'

import { useState } from 'react'
import { Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import type { ShippingMethodInput } from '@/src/types/checkout.types'

interface AvailableMethod {
  carrier_code: string
  carrier_title: string
  method_code: string
  method_title: string
  amount: {
    value: number
    currency: string
  }
}

interface Props {
  availableMethods: AvailableMethod[]
  onSave: (method: ShippingMethodInput) => Promise<boolean>
  isProcessing: boolean
  isActive: boolean
  isCompleted: boolean
  completedMethod?: ShippingMethodInput
}

export function ShippingMethodStep({
  availableMethods,
  onSave,
  isProcessing,
  isActive,
  isCompleted,
  completedMethod,
}: Props) {
  const [selectedMethod, setSelectedMethod] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMethod) return

    const [carrier_code, method_code] = selectedMethod.split('|')
    await onSave({ carrier_code, method_code })
  }

  if (!isActive && !isCompleted) return null

  if (isCompleted && completedMethod) {
    const selected = availableMethods.find(
      (m) => m.carrier_code === completedMethod.carrier_code && m.method_code === completedMethod.method_code
    )
    return (
      <div className="rounded-md border p-4 bg-muted/30 flex items-center justify-between">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            Método de Envío
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {selected ? `${selected.carrier_title} - ${selected.method_title}` : 'Método seleccionado'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border p-6 bg-card shadow-sm">
      <h3 className="text-lg font-medium mb-4">Método de Envío</h3>
      
      {availableMethods.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay métodos de envío disponibles para la dirección seleccionada.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            <div className="space-y-3">
              {availableMethods.map((method) => {
                const id = `${method.carrier_code}|${method.method_code}`
                return (
                  <div key={id} className="flex items-center space-x-3 rounded-md border p-4">
                    <RadioGroupItem value={id} id={id} />
                    <Label htmlFor={id} className="flex flex-1 items-center justify-between cursor-pointer">
                      <div>
                        <span className="block font-medium">{method.method_title}</span>
                        <span className="block text-sm text-muted-foreground">{method.carrier_title}</span>
                      </div>
                      <span className="font-medium">
                        {new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: method.amount.currency,
                        }).format(method.amount.value)}
                      </span>
                    </Label>
                  </div>
                )
              })}
            </div>
          </RadioGroup>

          <Button type="submit" disabled={!selectedMethod || isProcessing}>
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continuar con el Pago'}
          </Button>
        </form>
      )}
    </div>
  )
}
