import { UserDetail } from "@bitmetro/persona-types";

export interface OAuthVerificationDetails {
  email: string;
  userDetails: Partial<Record<UserDetail, string>>;
}

export interface OAuthVerifier {
  verifyAccessToken(providerAccessToken: string, userDetails: UserDetail[]): Promise<OAuthVerificationDetails | null>;
}
