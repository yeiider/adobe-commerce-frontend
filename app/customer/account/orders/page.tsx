import { Metadata } from 'next'
import { OrdersList } from '@/src/components/customer/account/OrdersList'

export const metadata: Metadata = {
  title: 'Mis Pedidos',
}

export default function OrdersPage() {
  return <OrdersList />
}
