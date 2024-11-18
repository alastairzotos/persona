import React, { useEffect, useState } from "react";
import { BaseUserType } from "@bitmetro/persona-types";
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

export function SessionProvider<U extends BaseUserType = BaseUserType>({ children }: React.PropsWithChildren) {
  const [initialised, setInitialised] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<U | undefined>();
  const { apiUrl, onLogin, onLogout } = useConfig<U>();

  useEffect(() => {
    checkAuth<U>(apiUrl).then(status => {
      setLoggedInUser(status.user);
      setInitialised(true);
    });
  }, [])

  const login = async (accessToken: string) => {
    const status = await checkAuth<U>(apiUrl);

    setLoggedInUser(status.user);

    if (status.user) {
      onLogin?.(status.user);
    }
  };

  const logout = async () => {
    await handleLogout(apiUrl);

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
