'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { useCustomer } from '@/src/hooks/use-customer'
import { changeCustomerPassword } from '@/src/services/customer.service'
import { toast } from 'sonner'

export function ProfileForm() {
  const { customer, isLoading, update } = useCustomer()

  const [info, setInfo] = useState({ firstname: '', lastname: '', is_subscribed: false })
  const [infoSaving, setInfoSaving] = useState(false)

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (customer) {
      setInfo({
        firstname: customer.firstname,
        lastname: customer.lastname,
        is_subscribed: customer.is_subscribed,
      })
    }
  }, [customer])

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!info.firstname.trim() || !info.lastname.trim()) return

    setInfoSaving(true)
    const updated = await update({
      firstname: info.firstname.trim(),
      lastname: info.lastname.trim(),
      is_subscribed: info.is_subscribed,
    })
    setInfoSaving(false)

    if (updated) {
      toast.success('Información actualizada')
    } else {
      toast.error('No se pudo actualizar la información')
    }
  }

  const validatePassword = () => {
    const e: Record<string, string> = {}
    if (!passwords.currentPassword) e.currentPassword = 'Requerido'
    if (!passwords.newPassword) {
      e.newPassword = 'Requerido'
    } else if (passwords.newPassword.length < 8) {
      e.newPassword = 'Mínimo 8 caracteres'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwords.newPassword)) {
      e.newPassword = 'Debe incluir mayúsculas, minúsculas y números'
    }
    if (!passwords.confirmPassword) {
      e.confirmPassword = 'Requerido'
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      e.confirmPassword = 'Las contraseñas no coinciden'
    }
    return e
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validatePassword()
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }

    setPasswordSaving(true)
    setPasswordErrors({})
    const ok = await changeCustomerPassword(passwords.currentPassword, passwords.newPassword)
    setPasswordSaving(false)

    if (ok) {
      toast.success('Contraseña actualizada correctamente')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      setPasswordErrors({ currentPassword: 'Contraseña actual incorrecta' })
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Editar Perfil</h1>

      {/* Información personal */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Información Personal
        </h2>
        <form onSubmit={handleInfoSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="firstname">Nombre</Label>
              <Input
                id="firstname"
                value={info.firstname}
                onChange={(e) => setInfo((p) => ({ ...p, firstname: e.target.value }))}
                disabled={infoSaving}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastname">Apellido</Label>
              <Input
                id="lastname"
                value={info.lastname}
                onChange={(e) => setInfo((p) => ({ ...p, lastname: e.target.value }))}
                disabled={infoSaving}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Correo electrónico</Label>
            <Input value={customer?.email || ''} disabled className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              El correo no puede modificarse desde aquí.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="newsletter"
              checked={info.is_subscribed}
              onCheckedChange={(v) => setInfo((p) => ({ ...p, is_subscribed: v === true }))}
              disabled={infoSaving}
            />
            <Label htmlFor="newsletter" className="text-sm font-normal cursor-pointer">
              Suscribirme a novedades y promociones
            </Label>
          </div>

          <Button type="submit" disabled={infoSaving} size="sm">
            {infoSaving ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar cambios'
            )}
          </Button>
        </form>
      </div>

      <Separator />

      {/* Cambio de contraseña */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Cambiar Contraseña
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {[
            { id: 'currentPassword', label: 'Contraseña actual', auto: 'current-password' },
            { id: 'newPassword', label: 'Nueva contraseña', auto: 'new-password' },
            { id: 'confirmPassword', label: 'Confirmar nueva contraseña', auto: 'new-password' },
          ].map(({ id, label, auto }) => (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={id}>{label}</Label>
              <Input
                id={id}
                type="password"
                autoComplete={auto}
                value={passwords[id as keyof typeof passwords]}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, [id]: e.target.value }))
                }
                className={passwordErrors[id] ? 'border-destructive' : ''}
                disabled={passwordSaving}
              />
              {passwordErrors[id] && (
                <p className="text-xs text-destructive">{passwordErrors[id]}</p>
              )}
            </div>
          ))}

          <Button type="submit" disabled={passwordSaving} size="sm">
            {passwordSaving ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Actualizando...
              </>
            ) : (
              'Cambiar contraseña'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
