'use client'

import { Check } from 'lucide-react'
import { AddressForm } from './AddressForm'
import type { AddressInput, ShippingAddressInput } from '@/src/types/checkout.types'

interface Props {
  onSave: (address: ShippingAddressInput) => Promise<boolean>
  isProcessing: boolean
  isActive: boolean
  isCompleted: boolean
  completedAddress?: AddressInput
}

export function ShippingAddressStep({ onSave, isProcessing, isActive, isCompleted, completedAddress }: Props) {
  
  const handleAddressSubmit = async (addressInput: AddressInput) => {
    const shippingAddress: ShippingAddressInput = {
      address: addressInput,
    }
    await onSave(shippingAddress)
  }

  if (!isActive && !isCompleted) return null

  if (isCompleted && completedAddress) {
    const regionName = typeof completedAddress.region === 'object' 
      // @ts-ignore
      ? (completedAddress.region?.name || completedAddress.region?.region || completedAddress.region?.code || '') 
      : (completedAddress.region || '')

    return (
      <div className="rounded-md border p-4 bg-muted/30 flex items-center justify-between">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            Dirección de Envío
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {completedAddress.firstname} {completedAddress.lastname}<br/>
            {completedAddress.street.join(', ')}<br/>
            {completedAddress.city}, {regionName} {completedAddress.postcode}<br/>
            {completedAddress.telephone}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border p-6 bg-card shadow-sm">
      <h3 className="text-lg font-medium mb-4">Dirección de Envío</h3>
      {/* 
        Si el usuario estuviera autenticado, aquí podríamos agregar un selector de direcciones 
        guardadas. Por modularidad, por ahora embebemos el formulario reactivo.
      */}
      <AddressForm onSave={handleAddressSubmit} isSaving={isProcessing} />
    </div>
  )
}
