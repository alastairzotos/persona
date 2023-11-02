import { PersonaProvider, LoginForm } from '@bitmetro/persona-react';

export default function Home() {
  return (
    <PersonaProvider
      apiUrl='http://localhost:3001'
    >
      <main className="p-24" style={{ width: 600 }}>
        <LoginForm />
      </main>
    </PersonaProvider>
  )
}

