import { TokenStorageMethod, UserDetail } from "@bitmetro/persona-types";
import { OAuthVerificationDetails, OAuthHandler } from "../models";

const googleFieldsToUserDetails = (info: any): Partial<Record<UserDetail, string>> => {
  return {
    display_name: info.name,
    first_name: info.given_name,
    last_name: info.family_name,
  }
}

export class GoogleOAuthProvider implements OAuthHandler {
  getLoginUrl(storageMethod: TokenStorageMethod, clientId: string, redirectUri: string): string {
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20profile%20email&state=${storageMethod}`;
  }

  async exchangeOAuthCodeForAccessToken(code: string, credentials: { id: string; secret: string; }, redirectUri: string): Promise<string | null> {
    const data = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: credentials.id,
        client_secret: credentials.secret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      })
    }).then((res) => res.json());

    if (data.error) {
      throw new Error(data.error);
    }

    return data.access_token as string;
  }

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
