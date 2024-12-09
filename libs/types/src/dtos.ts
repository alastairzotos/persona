import { OAuthProvider, UserDetails } from "./config";
import { BaseUserType } from "./misc";

export interface RegisterEmailPasswordDto {
  email: string;
  password: string;
  details: UserDetails;
  registerState?: string;
}

export interface LoginEmailPasswordRequestDto {
  email: string;
  password: string;
}

export interface LoginOAuthRequestDto {
  provider: OAuthProvider;
  providerAccessToken: string;
}

export interface AuthStatus<U extends BaseUserType = BaseUserType> {
  loggedIn: boolean;
  user?: U;
}
