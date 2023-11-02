import { UserDetails } from "@bitmetro/persona-types";

export type BaseUserType = object;

export interface PersonaAdapter<U extends BaseUserType = BaseUserType> {
  getUser(email: string): Promise<U>;
  createUser(email: string, details: UserDetails): Promise<U>;
}
