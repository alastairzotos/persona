import { RegisterForm } from '@bitmetro/persona-react';
import { useSearchParams } from 'next/navigation';

export default function RegisterPage() {
  const params = useSearchParams();

  return <RegisterForm fwdUrl={params.get('fwdUrl') || undefined} registerState="user-admin" includeOAuth />;
}
