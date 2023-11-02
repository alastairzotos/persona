import { BaseUserType } from '@bitmetro/persona-types';
import React from 'react';

export interface ConfigContextProps<U extends BaseUserType = BaseUserType> {
  apiUrl: string;
  gotoRegisterUrl: () => void;
  onLogin?: (user: U, accessToken: string) => void;
  onLogout?: () => void;
}

export const ConfigContext = React.createContext<ConfigContextProps>({
  apiUrl: '',
  gotoRegisterUrl: () => {},
});

export function useConfig<U extends BaseUserType = BaseUserType>() {
  return React.useContext(ConfigContext) as ConfigContextProps<U>;
}
