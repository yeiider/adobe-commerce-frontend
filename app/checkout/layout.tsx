import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'
import { StoreProvider } from '@/src/components/providers/StoreProvider'
import { getFullStoreContext } from '@/src/services/store.service'

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { storeConfig, currency, navigation } = await getFullStoreContext()

  return (
    <StoreProvider storeConfig={storeConfig} currency={currency}>
      <div className="flex min-h-screen flex-col">
        <Header navigation={navigation} />
        
        <main className="flex-1 bg-muted/10">
          {children}
        </main>
        
        <Footer />
      </div>
    </StoreProvider>
  )
}
