import { Metadata } from 'next'
import { WishlistClient } from './WishlistClient'

export const metadata: Metadata = {
  title: 'Lista de Deseos',
  description: 'Tu lista de productos favoritos. Guarda y comparte los productos que te gustan.',
}

export default function WishlistPage() {
  return <WishlistClient />
}
