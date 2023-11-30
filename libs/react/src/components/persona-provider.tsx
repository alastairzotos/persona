import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { ConfigContext, ConfigContextProps } from '../contexts/config.context';
import { BaseUserType } from '@bitmetro/persona-types';
import { SessionProvider } from '../contexts/session.context';
import { defaultTheme } from '../theme';

const queryClient = new QueryClient();

export function PersonaProvider<U extends BaseUserType = BaseUserType>({
  children,
  ...props
}: React.PropsWithChildren<ConfigContextProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigContext.Provider value={props}>
        <ThemeProvider theme={{ ...defaultTheme, ...props.theme } || defaultTheme}>
          <SessionProvider<U>>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </ConfigContext.Provider>
    </QueryClientProvider>
  )
}
