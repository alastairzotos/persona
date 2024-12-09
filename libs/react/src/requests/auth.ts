import axios from 'axios';
import {
  AccessTokenResponse,
  AuthStatus,
  BaseUserType,
  LoginEmailPasswordRequestDto,
  RegisterEmailPasswordDto,
  UserDetails
} from "@bitmetro/persona-types";
import { getAccessToken } from '../contexts/session.context';

export const registerEmailPassword = async (apiUrl: string, email: string, password: string, details: UserDetails, registerState?: string): Promise<AccessTokenResponse> => {
  const { data } = await axios.post(`${apiUrl}/persona/register?storage=cookie`, { email, password, details, registerState } as RegisterEmailPasswordDto, { withCredentials: true });

  return data;
}

export const loginEmailPassword = async (apiUrl: string, email: string, password: string): Promise<AccessTokenResponse> => {
  const { data } = await axios.post(`${apiUrl}/persona/login?storage=cookie`, { email, password } as LoginEmailPasswordRequestDto, { withCredentials: true });

  return data;
}

export const handleLogout = async (apiUrl: string) => {
  await axios.post(`${apiUrl}/persona/logout`, {}, { withCredentials: true });
}

export async function checkAuth<U extends BaseUserType = BaseUserType>(apiUrl: string): Promise<AuthStatus<U>> {
  try {
    const { data } = await axios.get(`${apiUrl}/persona/status`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    return data;
  } catch {
    return {
      loggedIn: false,
    };
  }
}