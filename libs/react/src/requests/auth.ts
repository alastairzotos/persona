import axios from 'axios';
import {
  AccessTokenResponse,
  AuthStatus,
  BaseUserType,
  LoginEmailPasswordRequestDto,
  RegisterEmailPasswordDto,
  TokenStorageMethod,
  UserDetails
} from "@bitmetro/persona-types";
import { getAccessToken } from '../contexts/session.context';

export const registerEmailPassword = async (apiUrl: string, email: string, password: string, details: UserDetails, storageMethod: TokenStorageMethod): Promise<AccessTokenResponse> => {
  const { data } = await axios.post(`${apiUrl}/persona/register?storage=${storageMethod}`, { email, password, details } as RegisterEmailPasswordDto, { withCredentials: storageMethod === 'cookie' });

  return data;
}

export const loginEmailPassword = async (apiUrl: string, email: string, password: string, storageMethod: TokenStorageMethod): Promise<AccessTokenResponse> => {
  const { data } = await axios.post(`${apiUrl}/persona/login?storage=${storageMethod}`, { email, password } as LoginEmailPasswordRequestDto, { withCredentials: storageMethod === 'cookie' });

  return data;
}

export const handleLogout = async () => {
  await axios.post('http://localhost:3001/persona/logout', {}, { withCredentials: true });
}

export async function checkAuth<U extends BaseUserType = BaseUserType>(): Promise<AuthStatus<U>> {
  try {
    const { data } = await axios.get('http://localhost:3001/persona/status', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      },
    });

    return data;
  } catch {
    return {
      loggedIn: false,
    };
  }
}