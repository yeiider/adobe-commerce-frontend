'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { requestPasswordResetEmail } from '@/src/services/customer.service'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresa un correo válido')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await requestPasswordResetEmail(email.trim())
      setSent(true)
    } catch {
      setError('Ocurrió un error. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <div className="space-y-1">
          <p className="font-medium">Correo enviado</p>
          <p className="text-sm text-muted-foreground">
            Si <span className="font-medium text-foreground">{email}</span> está registrado,
            recibirás las instrucciones para restablecer tu contraseña.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/customer/login">Volver a Iniciar Sesión</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@correo.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={error ? 'border-destructive' : ''}
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          'Enviar instrucciones'
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/customer/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Volver a Iniciar Sesión
        </Link>
      </p>
    </form>
  )
}
