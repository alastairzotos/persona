export type OAuthProvider = 'google' | 'facebook';
export type LoginMode = 'email-password' | OAuthProvider;

export type Credential<Public extends boolean> =
  Public extends true
  ? { id: string }
  : { id: string, secret: string };

export type OAuthCredentials<Public extends boolean> = Partial<Record<OAuthProvider, Credential<Public>>>;

export type UserDetail = 'first_name' | 'last_name' | 'display_name';
export type UserDetails = Partial<Record<UserDetail, string>>;

export const userDetailLabel: Record<UserDetail, string> = {
  first_name: 'First name',
  last_name: 'Last name',
  display_name: 'Display name',
}

export interface EmailPasswordConfig {
  userDetails: UserDetail[];
}

export interface Config<Public extends boolean> {
  emailPasswordConfig?: EmailPasswordConfig;
  credentials: OAuthCredentials<Public>;
}

export type PublicConfig = Config<true>;
export type PrivateConfig = Config<false>;

export interface AccessTokenResponse {
  accessToken: string;
}
