'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Check } from 'lucide-react'

interface Props {
  onSave: (email: string) => Promise<boolean>
  isProcessing: boolean
  isActive: boolean
  isCompleted: boolean
  defaultEmail?: string
}

export function GuestEmailStep({ onSave, isProcessing, isActive, isCompleted, defaultEmail }: Props) {
  const [email, setEmail] = useState(defaultEmail || '')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor ingresa un correo electrónico válido.')
      return
    }
    setError('')
    await onSave(email)
  }

  if (isCompleted) {
    return (
      <div className="rounded-md border p-4 bg-muted/30 flex items-center justify-between">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            Correo Electrónico
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{email}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border p-6 bg-card shadow-sm">
      <h3 className="text-lg font-medium mb-4">Paso 1: Correo Electrónico</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="guest-email">Ingresa tu correo para continuar</Label>
          <Input
            id="guest-email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isProcessing}
            className={error ? 'border-destructive' : ''}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continuar como Invitado'}
        </Button>
      </form>
    </div>
  )
}
