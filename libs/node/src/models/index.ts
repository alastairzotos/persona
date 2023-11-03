import { BaseUserType, UserDetail, UserDetails } from "@bitmetro/persona-types";

export interface PersonaAdapter<U extends BaseUserType = BaseUserType> {
  getUserByEmail(email: string): Promise<U | undefined>;
  createUser(email: string, details: UserDetails): Promise<U>;
  createUserWithPasswordHash?(email: string, details: UserDetails, passwordHash: string): Promise<U>;
  getUserPasswordHash?(user: U): Promise<string | undefined>;
  exchanceJwtPayloadForUser?(payload: U): Promise<U | undefined>;
}

export interface OAuthVerificationDetails {
  email: string;
  userDetails: Partial<Record<UserDetail, string>>;
}

export interface OAuthVerifier {
  verifyAccessToken(providerAccessToken: string): Promise<OAuthVerificationDetails | null>;
}
