import React from 'react';
import { BaseUserType } from '@bitmetro/persona-types';
import type { DefaultTheme } from 'styled-components';
import { defaultTheme } from '../theme';

export interface ConfigContextProps<U extends BaseUserType = BaseUserType> {
  apiUrl: string;
  onRegister?: (fwdUrl?: string) => void;
  onLogin?: (user: U, fwdUrl?: string) => void;
  onLogout?: () => void;
  theme?: Partial<DefaultTheme>;
}

export const ConfigContext = React.createContext<ConfigContextProps>({
  apiUrl: '',
  onRegister: () => {},
  theme: defaultTheme,
});

export function useConfig<U extends BaseUserType = BaseUserType>() {
  return React.useContext(ConfigContext) as ConfigContextProps<U>;
}
