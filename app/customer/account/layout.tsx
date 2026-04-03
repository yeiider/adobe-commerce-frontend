import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'
import { StoreProvider } from '@/src/components/providers/StoreProvider'
import { getFullStoreContext } from '@/src/services/store.service'
import { AccountSidebar } from '@/src/components/customer/account/AccountSidebar'
import { AuthGuard } from '@/src/components/customer/account/AuthGuard'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const { storeConfig, currency, navigation } = await getFullStoreContext()

  return (
    <StoreProvider storeConfig={storeConfig} currency={currency}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header navigation={navigation} />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <AuthGuard>
              <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                <AccountSidebar />
                <div className="min-w-0 flex-1">{children}</div>
              </div>
            </AuthGuard>
          </div>
        </main>

        <Footer />
      </div>
    </StoreProvider>
  )
}
