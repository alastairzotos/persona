import { UserDetail } from "@bitmetro/persona-types";
import { OAuthVerificationDetails, OAuthVerifier } from "./models";

const facebookFieldsToUserDetails = (info: any): Partial<Record<UserDetail, string>> => {
  return {
    display_name: info.name,
    first_name: info.first_name,
    last_name: info.last_name,
  }
}

export class FacebookOAuthProvider implements OAuthVerifier {
  async verifyAccessToken(providerAccessToken: string): Promise<OAuthVerificationDetails | null> {
    try {
      const res = await fetch(
        `https://graph.facebook.com/me?access_token=${providerAccessToken}&fields=email,name,first_name,last_name`
      );

      const result = await res.json();

      const { email, ...details } = result;

      return {
        email,
        userDetails: facebookFieldsToUserDetails(details),
      }
    } catch {
      return null;
    }
  }
}
