'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createCustomerAddress,
  updateCustomerAddress,
  getCountryRegions,
  type CountryRegion,
} from '@/src/services/customer.service'
import type { CustomerAddress } from '@/src/types/customer.types'

interface FormState {
  firstname: string
  lastname: string
  company: string
  street: string
  city: string
  regionId: string   // numeric id as string for Select value
  postcode: string
  telephone: string
  default_shipping: boolean
  default_billing: boolean
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
  default_shipping: false,
  default_billing: false,
}

interface Props {
  open: boolean
  onClose: () => void
  onSaved: (address: CustomerAddress) => void
  editing?: CustomerAddress | null
  defaultName?: { firstname: string; lastname: string }
}

export function AddressFormSheet({ open, onClose, onSaved, editing, defaultName }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [regions, setRegions] = useState<CountryRegion[]>([])
  const [regionsLoading, setRegionsLoading] = useState(false)

  // Load regions from Adobe Commerce once
  useEffect(() => {
    setRegionsLoading(true)
    getCountryRegions('CO').then((res) => {
      setRegions(res)
      setRegionsLoading(false)
    })
  }, [])

  // Populate form when sheet opens
  useEffect(() => {
    if (!open) return

    if (editing) {
      // Find matching region_id from the loaded regions list
      const matchedRegion = regions.find(
        (r) =>
          r.name === editing.region?.region ||
          r.code === (editing.region as unknown as Record<string, string>)?.region_code
      )
      setForm({
        firstname: editing.firstname,
        lastname: editing.lastname,
        company: editing.company || '',
        street: editing.street.join(', '),
        city: editing.city,
        regionId: matchedRegion ? String(matchedRegion.id) : '',
        postcode: editing.postcode,
        telephone: editing.telephone,
        default_shipping: editing.default_shipping,
        default_billing: editing.default_billing,
      })
    } else {
      setForm({
        ...EMPTY_FORM,
        firstname: defaultName?.firstname || '',
        lastname: defaultName?.lastname || '',
      })
    }
    setErrors({})
    setGeneralError('')
  }, [open, editing, defaultName, regions])

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }))

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.firstname.trim()) e.firstname = 'Requerido'
    if (!form.lastname.trim()) e.lastname = 'Requerido'
    if (!form.street.trim()) e.street = 'Requerido'
    if (!form.city.trim()) e.city = 'Requerido'
    if (!form.regionId) e.regionId = 'Selecciona un departamento'
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

    const input = {
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      ...(form.company.trim() && { company: form.company.trim() }),
      street: [form.street.trim()],
      city: form.city.trim(),
      region: selectedRegion
        ? {
            region_id: selectedRegion.id,
            region_code: selectedRegion.code,
            region: selectedRegion.name,
          }
        : undefined,
      postcode: form.postcode.trim(),
      country_code: 'CO',
      telephone: form.telephone.trim(),
      default_shipping: form.default_shipping,
      default_billing: form.default_billing,
    }

    setIsSaving(true)
    setErrors({})
    setGeneralError('')

    try {
      let saved: CustomerAddress | null = null

      if (editing) {
        saved = await updateCustomerAddress(editing.id, input as Partial<CustomerAddress>)
      } else {
        saved = await createCustomerAddress(input as Omit<CustomerAddress, 'id'>)
      }

      if (saved) {
        onSaved(saved)
        onClose()
      } else {
        setGeneralError('No se pudo guardar la dirección. Inténtalo de nuevo.')
      }
    } catch {
      setGeneralError('Ocurrió un error inesperado.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="flex w-full flex-col sm:max-w-md p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle>{editing ? 'Editar Dirección' : 'Nueva Dirección'}</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <form id="address-form" onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">
            {generalError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {generalError}
              </div>
            )}

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="addr-firstname">Nombre</Label>
                <Input
                  id="addr-firstname"
                  value={form.firstname}
                  onChange={set('firstname')}
                  className={errors.firstname ? 'border-destructive' : ''}
                  disabled={isSaving}
                />
                {errors.firstname && <p className="text-xs text-destructive">{errors.firstname}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-lastname">Apellido</Label>
                <Input
                  id="addr-lastname"
                  value={form.lastname}
                  onChange={set('lastname')}
                  className={errors.lastname ? 'border-destructive' : ''}
                  disabled={isSaving}
                />
                {errors.lastname && <p className="text-xs text-destructive">{errors.lastname}</p>}
              </div>
            </div>

            {/* Empresa */}
            <div className="space-y-1.5">
              <Label htmlFor="addr-company">
                Empresa <span className="text-xs text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="addr-company"
                value={form.company}
                onChange={set('company')}
                disabled={isSaving}
              />
            </div>

            {/* Dirección */}
            <div className="space-y-1.5">
              <Label htmlFor="addr-street">Dirección</Label>
              <Input
                id="addr-street"
                placeholder="Calle 123 # 45-67, Barrio"
                value={form.street}
                onChange={set('street')}
                className={errors.street ? 'border-destructive' : ''}
                disabled={isSaving}
              />
              {errors.street && <p className="text-xs text-destructive">{errors.street}</p>}
            </div>

            {/* Ciudad */}
            <div className="space-y-1.5">
              <Label htmlFor="addr-city">Ciudad / Municipio</Label>
              <Input
                id="addr-city"
                placeholder="Bogotá"
                value={form.city}
                onChange={set('city')}
                className={errors.city ? 'border-destructive' : ''}
                disabled={isSaving}
              />
              {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
            </div>

            {/* Departamento — desde Adobe Commerce */}
            <div className="space-y-1.5">
              <Label htmlFor="addr-region">Departamento</Label>
              <Select
                value={form.regionId}
                onValueChange={(v) => setForm((p) => ({ ...p, regionId: v }))}
                disabled={isSaving || regionsLoading}
              >
                <SelectTrigger
                  id="addr-region"
                  className={errors.regionId ? 'border-destructive' : ''}
                >
                  {regionsLoading ? (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Cargando...
                    </span>
                  ) : (
                    <SelectValue placeholder="Selecciona un departamento" />
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

            {/* Código Postal y Teléfono */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="addr-postcode">Código Postal</Label>
                <Input
                  id="addr-postcode"
                  placeholder="110111"
                  value={form.postcode}
                  onChange={set('postcode')}
                  className={errors.postcode ? 'border-destructive' : ''}
                  disabled={isSaving}
                />
                {errors.postcode && <p className="text-xs text-destructive">{errors.postcode}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-telephone">Teléfono</Label>
                <Input
                  id="addr-telephone"
                  placeholder="3001234567"
                  type="tel"
                  value={form.telephone}
                  onChange={set('telephone')}
                  className={errors.telephone ? 'border-destructive' : ''}
                  disabled={isSaving}
                />
                {errors.telephone && <p className="text-xs text-destructive">{errors.telephone}</p>}
              </div>
            </div>

            {/* País (fijo Colombia) */}
            <div className="space-y-1.5">
              <Label>País</Label>
              <Input value="Colombia" disabled className="text-muted-foreground" />
            </div>

            {/* Predeterminadas */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="default-shipping"
                  checked={form.default_shipping}
                  onCheckedChange={(v) => setForm((p) => ({ ...p, default_shipping: v === true }))}
                  disabled={isSaving}
                />
                <Label htmlFor="default-shipping" className="text-sm font-normal cursor-pointer">
                  Dirección de envío predeterminada
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="default-billing"
                  checked={form.default_billing}
                  onCheckedChange={(v) => setForm((p) => ({ ...p, default_billing: v === true }))}
                  disabled={isSaving}
                />
                <Label htmlFor="default-billing" className="text-sm font-normal cursor-pointer">
                  Dirección de facturación predeterminada
                </Label>
              </div>
            </div>
          </form>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" form="address-form" className="flex-1" disabled={isSaving || regionsLoading}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : editing ? (
              'Guardar cambios'
            ) : (
              'Agregar dirección'
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
