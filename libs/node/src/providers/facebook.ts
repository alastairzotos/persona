import { TokenStorageMethod, UserDetail } from "@bitmetro/persona-types";
import { OAuthVerificationDetails, OAuthHandler } from "../models";

const facebookFieldsToUserDetails = (info: any): Partial<Record<UserDetail, string>> => {
  return {
    display_name: info.name,
    first_name: info.first_name,
    last_name: info.last_name,
  }
}

export class FacebookOAuthProvider implements OAuthHandler {
  getLoginUrl(clientId: string, redirectUri: string): string {
    return `https://www.facebook.com/v10.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=email,public_profile`;
  }

  async exchangeOAuthCodeForAccessToken(code: string, credentials: { id: string; secret: string; }, redirectUri: string): Promise<string | null> {
    const data = await fetch(`https://graph.facebook.com/v10.0/oauth/access_token?code=${code}&client_id=${credentials.id}&client_secret=${credentials.secret}&redirect_uri=${redirectUri}`)
      .then(res => res.json());

    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return data.access_token as string;
  }

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
