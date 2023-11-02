import { UserDetail } from "@bitmetro/persona-types";

export interface OAuthVerificationDetails {
  email: string;
  userDetails: Partial<Record<UserDetail, string>>;
}

export interface OAuthVerifier {
  verifyAccessToken(providerAccessToken: string): Promise<OAuthVerificationDetails | null>;
}
