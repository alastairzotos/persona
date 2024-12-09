import { AccessTokenResponse, BaseUserType, TokenStorageMethod, Credential, UserDetail, UserDetails } from "@bitmetro/persona-types";

export interface PersonaAdapter<U extends BaseUserType = BaseUserType> {
  getUserByEmail(email: string): Promise<U | undefined>;
  createUser(email: string, details: UserDetails, registerState?: string): Promise<U>;
  createUserWithPasswordHash?(email: string, details: UserDetails, passwordHash: string, registerState?: string): Promise<U>;
  getUserPasswordHash?(user: U): Promise<string | undefined>;
  exchangeJwtPayloadForUser?(payload: U): Promise<U | undefined>;
}

export interface OAuthVerificationDetails {
  email: string;
  userDetails: Partial<Record<UserDetail, string>>;
}

export interface OAuthHandler {
  getLoginUrl(clientId: string, redirectUri: string): string;
  exchangeOAuthCodeForAccessToken(code: string, credentials: Credential<false>, redirectUri: string): Promise<string | null>;
  verifyAccessToken(providerAccessToken: string): Promise<OAuthVerificationDetails | null>;
}

export type LoginResult = "invalid-token" | "login-error" | "create-user-error" | AccessTokenResponse;
