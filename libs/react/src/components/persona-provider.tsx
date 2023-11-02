import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react'
import { PersonaContext, PersonaContextProps } from '../contexts/persona.context';
import { StatusProvider } from '../contexts/status.context';

const queryClient = new QueryClient();

export const PersonaProvider: React.FC<React.PropsWithChildren<PersonaContextProps>> = ({
  children,
  ...props
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PersonaContext.Provider value={props}>
        <ChakraProvider>
          <StatusProvider>
            {children}
          </StatusProvider>
        </ChakraProvider>
      </PersonaContext.Provider>
    </QueryClientProvider>
  )
}
