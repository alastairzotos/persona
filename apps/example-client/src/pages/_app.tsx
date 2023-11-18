import '@/styles/globals.css'
import { PersonaProvider, extendPersonaTheme } from '@bitmetro/persona-react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <PersonaProvider
      apiUrl='http://localhost:3001'
      onRegister={() => router.push('/register')}
      onLogin={() => router.push('/')}
      // theme={extendPersonaTheme({
      //   backgroundColor: '#d0ffcc',
      //   brandColor: '#9c0aa8',
      //   textColor: 'black',
      //   buttonTextColor: 'white',
      //   // showOutline: false,
      //   borderRadius: 0,
      //   fontFamily: 'Papyrus',
      // })}
    >
      <main className="p-24" style={{ width: 600 }}>
        <Component {...pageProps} />
      </main>
    </PersonaProvider>
  )
}
