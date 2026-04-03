import { Metadata } from 'next'
import { ProfileForm } from '@/src/components/customer/account/ProfileForm'

export const metadata: Metadata = {
  title: 'Editar Perfil',
}

export default function ProfilePage() {
  return <ProfileForm />
}
