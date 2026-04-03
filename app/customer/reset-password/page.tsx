import { Metadata } from 'next'
import { Suspense } from 'react'
import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'
import { StoreProvider } from '@/src/components/providers/StoreProvider'
import { getFullStoreContext } from '@/src/services/store.service'
import { ResetPasswordForm } from '@/src/components/customer/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Restablecer Contraseña',
  description: 'Crea una nueva contraseña para tu cuenta.',
}

export default async function ResetPasswordPage() {
  const { storeConfig, currency, navigation } = await getFullStoreContext()

  return (
    <StoreProvider storeConfig={storeConfig} currency={currency}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header navigation={navigation} />

        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Nueva Contraseña
              </h1>
              <p className="text-sm text-muted-foreground">
                Ingresa tu nueva contraseña
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <Suspense fallback={null}>
                <ResetPasswordForm />
              </Suspense>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </StoreProvider>
  )
}
