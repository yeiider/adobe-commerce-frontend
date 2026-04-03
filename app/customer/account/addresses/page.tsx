import { Metadata } from 'next'
import { AddressList } from '@/src/components/customer/account/AddressList'

export const metadata: Metadata = {
  title: 'Mis Direcciones',
}

export default function AddressesPage() {
  return <AddressList />
}
