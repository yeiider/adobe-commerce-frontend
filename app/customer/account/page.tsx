import { Metadata } from 'next'
import { AccountOverview } from '@/src/components/customer/account/AccountOverview'

export const metadata: Metadata = {
  title: 'Mi Cuenta',
  description: 'Gestiona tu cuenta, pedidos y direcciones.',
}

export default function AccountPage() {
  return <AccountOverview />
}
