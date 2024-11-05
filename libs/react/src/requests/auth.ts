import axios from 'axios';
import {
  AccessTokenResponse,
  LoginEmailPasswordRequestDto,
  RegisterEmailPasswordDto,
  UserDetails
} from "@bitmetro/persona-types";

export const registerEmailPassword = async (apiUrl: string, email: string, password: string, details: UserDetails): Promise<AccessTokenResponse> => {
  const { data } = await axios.post(`${apiUrl}/persona/register`, { email, password, details } as RegisterEmailPasswordDto, { withCredentials: true });

  return data;
}

export const loginEmailPassword = async (apiUrl: string, email: string, password: string): Promise<AccessTokenResponse> => {
  const { data } = await axios.post(`${apiUrl}/persona/login`, { email, password } as LoginEmailPasswordRequestDto, { withCredentials: true });

  return data;
}
