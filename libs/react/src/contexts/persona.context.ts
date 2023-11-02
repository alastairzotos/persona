import { BaseUserType } from "@bitmetro/persona-types";
import React from "react";

export interface PersonaContextProps<U extends BaseUserType = BaseUserType> {
  loggedInUser: U | undefined;
  logout: () => void;
}

export const PersonaContext = React.createContext<PersonaContextProps>({
  loggedInUser: undefined,
  logout() {},
})

export function usePersona<U extends BaseUserType = BaseUserType>() {
  return React.useContext(PersonaContext) as PersonaContextProps<U>;
}
