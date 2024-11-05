import React from 'react';
import { BaseUserType, TokenStorageMethod } from '@bitmetro/persona-types';
import type { DefaultTheme } from 'styled-components';
import { defaultTheme } from '../theme';

export interface ConfigContextProps<U extends BaseUserType = BaseUserType> {
  storageMethod?: TokenStorageMethod;
  apiUrl: string;
  onRegister?: () => void;
  onLogin?: (user: U) => void;
  onLogout?: () => void;
  theme?: Partial<DefaultTheme>;
}

export const ConfigContext = React.createContext<ConfigContextProps>({
  storageMethod: 'cookie',
  apiUrl: '',
  onRegister: () => {},
  theme: defaultTheme,
});

export function useConfig<U extends BaseUserType = BaseUserType>() {
  return React.useContext(ConfigContext) as ConfigContextProps<U>;
}
