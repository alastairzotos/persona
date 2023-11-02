import axios from 'axios';
import { AccessTokenResponse, OAuthProvider } from "@bitmetro/persona-types";
import { httpClient } from "./http-client";

export const loginWithOAuth = async (apiUrl: string, provider: OAuthProvider, providerAccessToken: string): Promise<AccessTokenResponse> => {
  const { data } = await axios.post(`${apiUrl}/persona/oauth/${provider}`, { providerAccessToken });

  return await data;
}
