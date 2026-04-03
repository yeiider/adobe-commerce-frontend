import { Metadata } from 'next'
import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'
import { StoreProvider } from '@/src/components/providers/StoreProvider'
import { getFullStoreContext } from '@/src/services/store.service'
import CartClient from './CartClient'

export const metadata: Metadata = {
  title: 'Tu Carrito',
  description: 'Revisa y gestiona los productos en tu carrito de compras.',
}

export default async function CartPageWrapper() {
  const { storeConfig, currency, navigation } = await getFullStoreContext()

  return (
    <StoreProvider storeConfig={storeConfig} currency={currency}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header navigation={navigation} />
        
        <main className="flex-1">
          <CartClient />
        </main>
        
        <Footer />
      </div>
    </StoreProvider>
  )
}
