import { Metadata } from 'next'
import { Suspense } from 'react'
import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'
import { StoreProvider } from '@/src/components/providers/StoreProvider'
import { getFullStoreContext } from '@/src/services/store.service'
import { LoginForm } from '@/src/components/customer/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar Sesión',
  description: 'Accede a tu cuenta para ver tus pedidos, direcciones y más.',
}

export default async function LoginPage() {
  const { storeConfig, currency, navigation } = await getFullStoreContext()

  return (
    <StoreProvider storeConfig={storeConfig} currency={currency}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header navigation={navigation} />

        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {/* Header del formulario */}
            <div className="mb-8 space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Iniciar Sesión
              </h1>
              <p className="text-sm text-muted-foreground">
                Accede a tu cuenta para continuar
              </p>
            </div>

            {/* Formulario */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <Suspense fallback={null}>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </StoreProvider>
  )
}
