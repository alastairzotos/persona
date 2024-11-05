import React, { useEffect } from "react";
import { usePersona } from '@bitmetro/persona-react';
import { usePage } from "@/contexts/page.context";

export const Protected: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { initialised, loggedInUser } = usePersona();
  const { page, setPage } = usePage();

  useEffect(() => {
    if (initialised && !loggedInUser && page !== 'login') {
      setPage('login')
    }
  }, [initialised, loggedInUser, page]);
  
  if (!initialised || !loggedInUser) {
    return null;
  }

  return (
    <>
      {children}
    </>
  )
}
