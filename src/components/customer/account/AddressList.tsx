'use client'

import { useEffect, useState } from 'react'
import { MapPin, Loader2, Plus, Trash2, CheckCircle, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getCustomerAddresses, deleteCustomerAddress } from '@/src/services/customer.service'
import { useCustomer } from '@/src/hooks/use-customer'
import type { CustomerAddress } from '@/src/types/customer.types'
import { toast } from 'sonner'
import { AddressFormSheet } from './AddressFormSheet'

export function AddressList() {
  const { customer } = useCustomer()
  const [addresses, setAddresses] = useState<CustomerAddress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<CustomerAddress | null>(null)

  useEffect(() => {
    getCustomerAddresses().then((res) => {
      setAddresses(res || [])
      setIsLoading(false)
    })
  }, [])

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    const ok = await deleteCustomerAddress(id)
    if (ok) {
      setAddresses((prev) => prev.filter((a) => a.id !== id))
      toast.success('Dirección eliminada')
    } else {
      toast.error('No se pudo eliminar la dirección')
    }
    setDeletingId(null)
  }

  const openNew = () => {
    setEditing(null)
    setSheetOpen(true)
  }

  const openEdit = (address: CustomerAddress) => {
    setEditing(address)
    setSheetOpen(true)
  }

  const handleSaved = (saved: CustomerAddress) => {
    if (editing) {
      setAddresses((prev) => prev.map((a) => (a.id === saved.id ? saved : a)))
      toast.success('Dirección actualizada')
    } else {
      setAddresses((prev) => [...prev, saved])
      toast.success('Dirección agregada')
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Mis Direcciones</h1>
          <Button size="sm" onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva dirección
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <MapPin className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-medium text-foreground">No tienes direcciones guardadas</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Agrega una dirección para agilizar tus compras.
            </p>
            <Button className="mt-4" onClick={openNew}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar dirección
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="rounded-xl border border-border bg-card p-5 space-y-3"
              >
                {/* Badges + acciones */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {address.default_shipping && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Envío predeterminado
                      </Badge>
                    )}
                    {address.default_billing && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Facturación
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => openEdit(address)}
                      aria-label="Editar dirección"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(address.id)}
                      disabled={deletingId === address.id}
                      aria-label="Eliminar dirección"
                    >
                      {deletingId === address.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Datos */}
                <div className="text-sm space-y-0.5">
                  <p className="font-medium text-foreground">
                    {address.firstname} {address.lastname}
                  </p>
                  {address.company && (
                    <p className="text-muted-foreground">{address.company}</p>
                  )}
                  <p className="text-muted-foreground">{address.street.join(', ')}</p>
                  <p className="text-muted-foreground">
                    {address.city}
                    {address.region?.region && `, ${address.region.region}`}
                    {address.postcode && ` ${address.postcode}`}
                  </p>
                  <p className="text-muted-foreground">{address.country_code}</p>
                  {address.telephone && (
                    <p className="text-muted-foreground">{address.telephone}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddressFormSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSaved={handleSaved}
        editing={editing}
        defaultName={
          customer
            ? { firstname: customer.firstname, lastname: customer.lastname }
            : undefined
        }
      />
    </>
  )
}
