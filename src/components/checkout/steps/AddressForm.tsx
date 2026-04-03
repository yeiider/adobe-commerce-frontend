'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getCountryRegions, type CountryRegion } from '@/src/services/customer.service'
import type { AddressInput } from '@/src/types/checkout.types'

interface FormState {
  firstname: string
  lastname: string
  company: string
  street: string
  city: string
  regionId: string
  postcode: string
  telephone: string
}

interface FormErrors {
  firstname?: string
  lastname?: string
  street?: string
  city?: string
  regionId?: string
  postcode?: string
  telephone?: string
}

const EMPTY_FORM: FormState = {
  firstname: '',
  lastname: '',
  company: '',
  street: '',
  city: '',
  regionId: '',
  postcode: '',
  telephone: '',
}

interface Props {
  onSave: (addressInput: AddressInput) => Promise<void>
  isSaving: boolean
  defaultValues?: Partial<FormState>
}

export function AddressForm({ onSave, isSaving, defaultValues }: Props) {
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM, ...defaultValues })
  const [errors, setErrors] = useState<FormErrors>({})
  const [regions, setRegions] = useState<CountryRegion[]>([])
  const [regionsLoading, setRegionsLoading] = useState(false)

  useEffect(() => {
    setRegionsLoading(true)
    getCountryRegions('CO').then((res) => {
      setRegions(res)
      setRegionsLoading(false)
    })
  }, [])

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }))

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.firstname.trim()) e.firstname = 'Requerido'
    if (!form.lastname.trim()) e.lastname = 'Requerido'
    if (!form.street.trim()) e.street = 'Requerido'
    if (!form.city.trim()) e.city = 'Requerido'
    if (!form.regionId) e.regionId = 'Requerido'
    if (!form.postcode.trim()) e.postcode = 'Requerido'
    if (!form.telephone.trim()) e.telephone = 'Requerido'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const selectedRegion = regions.find((r) => String(r.id) === form.regionId)

    const addressInput: AddressInput = {
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      company: form.company.trim() || undefined,
      street: [form.street.trim()],
      city: form.city.trim(),
      postcode: form.postcode.trim(),
      country_code: 'CO',
      telephone: form.telephone.trim(),
    }

    if (selectedRegion?.id) {
      addressInput.region_id = Number(selectedRegion.id)
      addressInput.region = selectedRegion.code
    } else if (selectedRegion?.name) {
      addressInput.region = selectedRegion.name
    }

    setErrors({})
    await onSave(addressInput)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-md border p-4 bg-card">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="checkout-firstname">Nombre</Label>
          <Input
            id="checkout-firstname"
            value={form.firstname}
            onChange={set('firstname')}
            className={errors.firstname ? 'border-destructive' : ''}
            disabled={isSaving}
          />
          {errors.firstname && <p className="text-xs text-destructive">{errors.firstname}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="checkout-lastname">Apellido</Label>
          <Input
            id="checkout-lastname"
            value={form.lastname}
            onChange={set('lastname')}
            className={errors.lastname ? 'border-destructive' : ''}
            disabled={isSaving}
          />
          {errors.lastname && <p className="text-xs text-destructive">{errors.lastname}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="checkout-street">Dirección</Label>
        <Input
          id="checkout-street"
          placeholder="Calle 123 # 45-67"
          value={form.street}
          onChange={set('street')}
          className={errors.street ? 'border-destructive' : ''}
          disabled={isSaving}
        />
        {errors.street && <p className="text-xs text-destructive">{errors.street}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="checkout-city">Ciudad / Municipio</Label>
          <Input
            id="checkout-city"
            value={form.city}
            onChange={set('city')}
            className={errors.city ? 'border-destructive' : ''}
            disabled={isSaving}
          />
          {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="checkout-region">Departamento</Label>
          <Select
            value={form.regionId}
            onValueChange={(v) => setForm((p) => ({ ...p, regionId: v }))}
            disabled={isSaving || regionsLoading}
          >
            <SelectTrigger
              id="checkout-region"
              className={errors.regionId ? 'border-destructive' : ''}
            >
              {regionsLoading ? (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Cargando...
                </span>
              ) : (
                <SelectValue placeholder="Selecciona..." />
              )}
            </SelectTrigger>
            <SelectContent>
              {regions.map((r) => (
                <SelectItem key={r.id} value={String(r.id)}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.regionId && <p className="text-xs text-destructive">{errors.regionId}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="checkout-postcode">Código Postal</Label>
          <Input
            id="checkout-postcode"
            value={form.postcode}
            onChange={set('postcode')}
            className={errors.postcode ? 'border-destructive' : ''}
            disabled={isSaving}
          />
          {errors.postcode && <p className="text-xs text-destructive">{errors.postcode}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="checkout-telephone">Teléfono</Label>
          <Input
            id="checkout-telephone"
            type="tel"
            value={form.telephone}
            onChange={set('telephone')}
            className={errors.telephone ? 'border-destructive' : ''}
            disabled={isSaving}
          />
          {errors.telephone && <p className="text-xs text-destructive">{errors.telephone}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full mt-4" disabled={isSaving || regionsLoading}>
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continuar'}
      </Button>
    </form>
  )
}
