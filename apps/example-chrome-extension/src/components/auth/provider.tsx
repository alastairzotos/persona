import { PersonaProvider } from "@bitmetro/persona-react";
import React from "react";
import { usePage } from "../../contexts/page.context";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { setPage } = usePage();

  return (
    <PersonaProvider
      apiUrl={'http://localhost:3001'}
      storageMethod="localstorage"
      onRegister={() => setPage('register')}
      onLogin={() => setPage('home')}
    >
      {children}
    </PersonaProvider>
  )
}
