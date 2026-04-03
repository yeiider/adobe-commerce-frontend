import { Metadata } from 'next'
import { OrderDetail } from '@/src/components/customer/account/orders/OrderDetail'

interface OrderDetailPageProps {
  params: Promise<{ orderNumber: string }>
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { orderNumber } = await params
  return { title: `Pedido #${orderNumber}` }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderNumber } = await params
  return <OrderDetail orderNumber={orderNumber} />
}
