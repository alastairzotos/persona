import { OAuthProvider, UserDetails } from "./config";

export interface RegisterEmailPasswordDto {
  email: string;
  password: string;
  details: UserDetails;
}

export interface LoginEmailPasswordRequestDto {
  email: string;
  password: string;
}

export interface LoginOAuthRequestDto {
  provider: OAuthProvider;
  providerAccessToken: string;
}
