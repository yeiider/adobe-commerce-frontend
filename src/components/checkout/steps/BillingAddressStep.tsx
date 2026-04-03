'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Check } from 'lucide-react'
import { AddressForm } from './AddressForm'
import type { BillingAddressInput, AddressInput } from '@/src/types/checkout.types'

interface Props {
  onSave: (billingAddress: BillingAddressInput) => Promise<boolean>
  isProcessing: boolean
  isActive: boolean
  isCompleted: boolean
  shippingAddress?: AddressInput // Pass this to use same-as-shipping
}

export function BillingAddressStep({ onSave, isProcessing, isActive, isCompleted, shippingAddress }: Props) {
  const [sameAsShipping, setSameAsShipping] = useState(true)

  const handleSameAsShippingSave = async () => {
    // We map the raw Magento shipping address output into the required AddressInput payload
    const sAddr = shippingAddress as any

    const mappedAddress: AddressInput = {
      firstname: sAddr.firstname,
      lastname: sAddr.lastname,
      company: sAddr.company || undefined,
      street: sAddr.street,
      city: sAddr.city,
      postcode: sAddr.postcode,
      telephone: sAddr.telephone,
      country_code: sAddr.country?.code || 'CO',
    }

    if (sAddr.region?.region_id) {
      mappedAddress.region_id = sAddr.region.region_id
      mappedAddress.region = sAddr.region.code
    } else {
      mappedAddress.region = typeof sAddr.region === 'object' ? sAddr.region.region : sAddr.region
    }

    await onSave({
      same_as_shipping: true,
      address: mappedAddress
    })
  }

  const handleNewAddressSave = async (address: AddressInput) => {
    await onSave({
      same_as_shipping: false,
      address
    })
  }

  if (!isActive && !isCompleted) return null

  if (isCompleted) {
    return (
      <div className="rounded-md border p-4 bg-muted/30 flex items-center justify-between">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            Dirección de Facturación
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {sameAsShipping ? 'Misma dirección de envío' : 'Dirección diferente guardada'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border p-6 bg-card shadow-sm">
      <h3 className="text-lg font-medium mb-4">Dirección de Facturación</h3>

      <div className="space-y-4">
        {shippingAddress && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="same-as-shipping"
              checked={sameAsShipping}
              onCheckedChange={(val) => setSameAsShipping(val as boolean)}
              disabled={isProcessing}
            />
            <Label htmlFor="same-as-shipping">Mis datos de facturación son iguales a los de envío</Label>
          </div>
        )}

        {sameAsShipping ? (
          <Button onClick={handleSameAsShippingSave} disabled={isProcessing} className="mt-4">
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continuar'}
          </Button>
        ) : (
          <div className="mt-4">
            <AddressForm onSave={handleNewAddressSave} isSaving={isProcessing} />
          </div>
        )}
      </div>
    </div>
  )
}
