'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useCustomer } from '@/src/hooks/use-customer'
import { toast } from 'sonner'

interface FormData {
  firstname: string
  lastname: string
  email: string
  password: string
  confirmPassword: string
  is_subscribed: boolean
}

interface FormErrors {
  firstname?: string
  lastname?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

export function RegisterForm() {
  const router = useRouter()
  const { register } = useCustomer()

  const [form, setForm] = useState<FormData>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    is_subscribed: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.firstname.trim()) e.firstname = 'El nombre es requerido'
    if (!form.lastname.trim()) e.lastname = 'El apellido es requerido'
    if (!form.email.trim()) {
      e.email = 'El correo es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Ingresa un correo válido'
    }
    if (!form.password) {
      e.password = 'La contraseña es requerida'
    } else if (form.password.length < 8) {
      e.password = 'Mínimo 8 caracteres'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      e.password = 'Debe incluir mayúsculas, minúsculas y números'
    }
    if (!form.confirmPassword) {
      e.confirmPassword = 'Confirma tu contraseña'
    } else if (form.password !== form.confirmPassword) {
      e.confirmPassword = 'Las contraseñas no coinciden'
    }
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const customer = await register({
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        password: form.password,
        is_subscribed: form.is_subscribed,
      })

      if (customer) {
        toast.success(`¡Bienvenido, ${customer.firstname}! Tu cuenta ha sido creada.`)
        router.push('/customer/account')
        router.refresh()
      } else {
        setErrors({ general: 'No fue posible crear tu cuenta. El correo puede estar en uso.' })
      }
    } catch {
      setErrors({ general: 'Ocurrió un error al crear la cuenta. Inténtalo de nuevo.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const field = (id: keyof FormErrors, label: string, type: string, placeholder: string, autoComplete: string, showToggle?: boolean, showValue?: boolean, onToggle?: () => void) => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showToggle ? (showValue ? 'text' : 'password') : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={form[id as keyof FormData] as string}
          onChange={set(id as keyof FormData)}
          className={errors[id] ? (showToggle ? 'border-destructive pr-10' : 'border-destructive') : showToggle ? 'pr-10' : ''}
          disabled={isSubmitting}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
            aria-label={showValue ? 'Ocultar' : 'Mostrar'}
          >
            {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {errors[id] && <p className="text-xs text-destructive">{errors[id]}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errors.general && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="firstname">Nombre</Label>
          <Input
            id="firstname"
            type="text"
            placeholder="Juan"
            autoComplete="given-name"
            value={form.firstname}
            onChange={set('firstname')}
            className={errors.firstname ? 'border-destructive' : ''}
            disabled={isSubmitting}
          />
          {errors.firstname && <p className="text-xs text-destructive">{errors.firstname}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastname">Apellido</Label>
          <Input
            id="lastname"
            type="text"
            placeholder="Pérez"
            autoComplete="family-name"
            value={form.lastname}
            onChange={set('lastname')}
            className={errors.lastname ? 'border-destructive' : ''}
            disabled={isSubmitting}
          />
          {errors.lastname && <p className="text-xs text-destructive">{errors.lastname}</p>}
        </div>
      </div>

      {field('email', 'Correo electrónico', 'email', 'tu@correo.com', 'email')}

      {field('password', 'Contraseña', 'password', '••••••••', 'new-password', true, showPassword, () => setShowPassword(!showPassword))}

      {field('confirmPassword', 'Confirmar contraseña', 'password', '••••••••', 'new-password', true, showConfirm, () => setShowConfirm(!showConfirm))}

      <div className="flex items-center gap-2">
        <Checkbox
          id="newsletter"
          checked={form.is_subscribed}
          onCheckedChange={(checked) =>
            setForm((prev) => ({ ...prev, is_subscribed: checked === true }))
          }
          disabled={isSubmitting}
        />
        <Label htmlFor="newsletter" className="text-sm font-normal text-muted-foreground cursor-pointer">
          Suscribirme a novedades y promociones
        </Label>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          'Crear Cuenta'
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link
          href="/customer/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </form>
  )
}
