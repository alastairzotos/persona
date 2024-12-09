import '@/styles/globals.css'
import { PersonaProvider } from '@bitmetro/persona-react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <PersonaProvider
      apiUrl='http://localhost:3001'
      onRegister={(fwdUrl) => router.push(`/register?fwdUrl=${fwdUrl}`)}
      onLogin={(_, fwdUrl) => router.push(fwdUrl || '/')}
      theme={{
        brandColor: '#2c63e6'
      }}
    >
      <main className="p-24" style={{ width: 600 }}>
        <Component {...pageProps} />
      </main>
    </PersonaProvider>
  )
}
