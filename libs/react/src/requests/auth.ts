import axios from 'axios';
import {
  AccessTokenResponse,
  LoginEmailPasswordRequestDto,
  LoginOAuthRequestDto,
  OAuthProvider,
  RegisterEmailPasswordDto,
  UserDetails
} from "@bitmetro/persona-types";

export const registerEmailPassword = async (apiUrl: string, email: string, password: string, details: UserDetails): Promise<AccessTokenResponse> => {
  const { data } = await axios.post(`${apiUrl}/persona/register`, { email, password, details } as RegisterEmailPasswordDto);

  return data;
}

export const loginEmailPassword = async (apiUrl: string, email: string, password: string): Promise<AccessTokenResponse> => {
  const { data } = await axios.post(`${apiUrl}/persona/login`, { email, password } as LoginEmailPasswordRequestDto);

  return data;
}

export const loginWithOAuth = async (apiUrl: string, provider: OAuthProvider, providerAccessToken: string): Promise<AccessTokenResponse> => {
  const { data } = await axios.post(`${apiUrl}/persona/oauth`, { provider, providerAccessToken } as LoginOAuthRequestDto);

  return data;
}
