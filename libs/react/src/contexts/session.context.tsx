import React, { useEffect, useState } from "react";
import { BaseUserType } from "@bitmetro/persona-types";
import * as jwt from 'jsonwebtoken';
import { useConfig } from "./config.context";
import { PersonaContext } from "./persona.context";
import { checkAuth, handleLogout } from "../requests/auth";

export interface SessionContextProps {
  login(accessToken: string): Promise<void>;
}

export const SessionContext = React.createContext<SessionContextProps>({
  async login() { }
})

export const useSession = () => React.useContext(SessionContext);

const LOCAL_STORAGE_KEY = '@bitmetro/persona-key';

export const getAccessToken = () => localStorage.getItem(LOCAL_STORAGE_KEY);

function getUserFromLocalstorage<U extends BaseUserType = BaseUserType>(): U | undefined {
  const item = getAccessToken();
  if (item) {
    return jwt.decode(item) as U;
  }
}

export function SessionProvider<U extends BaseUserType = BaseUserType>({ children }: React.PropsWithChildren) {
  const [initialised, setInitialised] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<U | undefined>();
  const { apiUrl, onLogin, onLogout, storageMethod } = useConfig<U>();

  useEffect(() => {
    if (storageMethod === 'cookie') {
      checkAuth<U>(apiUrl).then(status => setLoggedInUser(status.user));
    } else {
      setLoggedInUser(getUserFromLocalstorage<U>());
    }

    setInitialised(true);
  }, [])

  const login = async (accessToken: string) => {
    if (storageMethod === 'cookie') {
      const status = await checkAuth<U>(apiUrl);
      
      setLoggedInUser(status.user);

      if (status.user) {
        onLogin?.(status.user);
      }
    } else if (storageMethod === 'localstorage') {
      localStorage.setItem(LOCAL_STORAGE_KEY, accessToken);

      const user = jwt.decode(accessToken) as U;
      setLoggedInUser(user);
      onLogin?.(user);
    }
  };

  const logout = async () => {
    if (storageMethod === 'cookie') {
      await handleLogout(apiUrl);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    setLoggedInUser(undefined);
    onLogout?.();
  }

  return (
    <PersonaContext.Provider
      value={{
        initialised,
        loggedInUser,
        logout
      }}
    >
      <SessionContext.Provider value={{ login }}>
        {children}
      </SessionContext.Provider>
    </PersonaContext.Provider>
  )
}
