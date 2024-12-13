import { BaseUserType } from "@bitmetro/persona-types";
import React from "react";

export interface PersonaContextProps<U extends BaseUserType = BaseUserType> {
  initialised?: boolean;
  loggedInUser: U | undefined;
  logout: () => Promise<void>;
  revalidate: () => Promise<void>;
}

export const PersonaContext = React.createContext<PersonaContextProps>({
  initialised: false,
  loggedInUser: undefined,
  async logout() { },
  async revalidate() { },
})

export function usePersona<U extends BaseUserType = BaseUserType>() {
  return React.useContext(PersonaContext) as PersonaContextProps<U>;
}
