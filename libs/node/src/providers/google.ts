import { UserDetail } from "@bitmetro/persona-types";
import { OAuthVerificationDetails, OAuthVerifier } from "./models";

const userDetailsMap: Record<UserDetail, string> = {
  display_name: 'name',
  first_name: 'given_name',
  last_name: 'family_name'
}

const userDetailsToGoogleFields = (userDetails: UserDetail[]) =>
  userDetails.map(detail => userDetailsMap[detail]).join(',');

const googleFieldsToUserDetails = (info: any): Partial<Record<UserDetail, string>> => {
  return {
    display_name: info.name,
    first_name: info.given_name,
    last_name: info.family_name,
  }
}

export class GoogleOAuthProvider implements OAuthVerifier {
  async verifyAccessToken(providerAccessToken: string): Promise<OAuthVerificationDetails | null> {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: {
          Authorization: `Bearer ${providerAccessToken}`
        }
      });

      const result = await res.json();

      const { email, ...details } = result;

      return {
        email,
        userDetails: googleFieldsToUserDetails(details),
      };
    } catch {
      return null;
    }
  }
}
