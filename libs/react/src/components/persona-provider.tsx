import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigContext, ConfigContextProps } from '../contexts/config.context';
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
          {children}
        </SessionProvider>
      </ConfigContext.Provider>
    </QueryClientProvider>
  )
}
