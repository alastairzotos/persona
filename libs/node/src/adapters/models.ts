import { BaseUserType, UserDetails } from "@bitmetro/persona-types";

export interface PersonaAdapter<U extends BaseUserType = BaseUserType> {
  getUserByEmail(email: string): Promise<U>;
  createUser(email: string, details: UserDetails): Promise<U>;
  createUserWithPasswordHash(email: string, details: UserDetails, passwordHash: string): Promise<U>;
  getUserPasswordHash(user: U): Promise<string | undefined>;
}
