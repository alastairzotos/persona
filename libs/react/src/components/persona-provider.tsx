import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react'
import { ConfigContext, ConfigContextProps } from '../contexts/config.context';
import { StatusProvider } from '../contexts/status.context';
import { BaseUserType } from '@bitmetro/persona-types';
import { SessionProvider } from '../contexts/session.context';

const queryClient = new QueryClient();

export function PersonaProvider<U extends BaseUserType = BaseUserType>({
  children,
  ...props
}: React.PropsWithChildren<ConfigContextProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigContext.Provider value={props}>
        <SessionProvider<U>>
          <ChakraProvider>
            <StatusProvider>
              {children}
            </StatusProvider>
          </ChakraProvider>
        </SessionProvider>
      </ConfigContext.Provider>
    </QueryClientProvider>
  )
}
