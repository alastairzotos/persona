import { UserDetail } from "@bitmetro/persona-types";
import { OAuthVerificationDetails, OAuthVerifier } from "./models";

const userDetailsMap: Record<UserDetail, string> = {
  display_name: 'name',
  first_name: 'first_name',
  last_name: 'last_name'
}

const userDetailsToFacebookFields = (userDetails: UserDetail[]) =>
  "email," + userDetails.map(detail => userDetailsMap[detail]).join(',');

const facebookFieldsToUserDetails = (info: any): Partial<Record<UserDetail, string>> => {
  return {
    display_name: info.name,
    first_name: info.first_name,
    last_name: info.last_name,
  }
}

export class FacebookOAuthProvider implements OAuthVerifier {
  async verifyAccessToken(providerAccessToken: string, userDetails: UserDetail[]): Promise<OAuthVerificationDetails | null> {
    try {
      const res = await fetch(
        `https://graph.facebook.com/me?access_token=${providerAccessToken}&fields=${userDetailsToFacebookFields(userDetails)}`
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
