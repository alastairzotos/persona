import { AccessTokenResponse, BaseUserType, TokenStorageMethod, OAuthProvider, UserDetails, Credential } from '@bitmetro/persona-types';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { GoogleOAuthProvider } from '../providers/google';
import { FacebookOAuthProvider } from '../providers/facebook';
import { mapRecord } from '../utils';
import { PersonaAdapter, OAuthHandler, LoginResult } from '../models';

const providers: Record<OAuthProvider, OAuthHandler> = {
  google: new GoogleOAuthProvider(),
  facebook: new FacebookOAuthProvider(),
}

export class PersonaService<U extends BaseUserType = BaseUserType> {
  constructor(
    private jwtSigningKey: string,
    private adapter: PersonaAdapter<U>,
  ) { }

  async verifyAccessToken(accessToken: string): Promise<U | 'invalid-token' | 'user-not-found'> {
    try {
      let payload = jwt.verify(accessToken, this.jwtSigningKey) as U | undefined;

      if (payload) {
        payload = await this.adapter.exchangeJwtPayloadForUser?.(payload) || payload;

        if (!payload) {
          return 'user-not-found';
        }

        return payload;
      }

      return 'invalid-token'
    } catch {
      return 'invalid-token';
    }
  }

  async registerWithEmailPassword(email: string, password: string, details: UserDetails, registerState?: string): Promise<AccessTokenResponse | 'existing-user' | 'no-create-method'> {
    const existing = await this.adapter.getUserByEmail(email);

    if (!!existing) {
      return 'existing-user';
    }

    if (!this.adapter.createUserWithPasswordHash) {
      return 'no-create-method';
    }

    const user = await this.adapter.createUserWithPasswordHash(email, details, await this.hashPassword(password), registerState);

    return {
      accessToken: this.generateAccessToken(user)
    }
  }

  async loginEmailPassword(email: string, password: string): Promise<AccessTokenResponse | 'no-user' | 'invalid-password' | 'no-pwd-hash-method'> {
    const user = await this.adapter.getUserByEmail(email);

    if (!user) {
      return 'no-user';
    }

    if (!this.adapter.getUserPasswordHash) {
      return 'no-pwd-hash-method';
    }

    if (!await this.comparePasswords(password, await this.adapter.getUserPasswordHash(user) || '')) {
      return 'invalid-password';
    }

    return {
      accessToken: this.generateAccessToken(user)
    }
  }

  getOAuthProviderLoginUrl(
    provider: OAuthProvider,
    clientId: string,
    redirectUri: string,
    storageMethod: TokenStorageMethod,
    fwdUrl?: string,
    registerState?: string,
  ) {
    const baseUrl = providers[provider].getLoginUrl(clientId, redirectUri);

    const stateParam = btoa(JSON.stringify({ storageMethod, fwdUrl, registerState }));

    return baseUrl + `&state=${stateParam}`;
  }

  async exchangeOAuthCodeForJwt(
    provider: OAuthProvider,
    code: string,
    credentials: Credential<false>,
    redirectUri: string,
    registerState?: string,
  ): Promise<LoginResult> {
    const accessToken = await providers[provider].exchangeOAuthCodeForAccessToken(code, credentials, redirectUri);

    if (accessToken === null) {
      return 'login-error';
    }

    const details = await providers[provider].verifyAccessToken(accessToken);

    if (!details) {
      return 'invalid-token';
    }

    const { email, userDetails } = details;

    let user = await this.adapter.getUserByEmail(email);

    if (!user) {
      user = await this.adapter.createUser(
        email,
        mapRecord(userDetails as Record<string, string>, (value) => value?.trim()),
        registerState
      );
    }

    if (!user) {
      return 'create-user-error';
    }

    return {
      accessToken: this.generateAccessToken(user),
    }
  }

  generateAccessToken(data: U): string {
    return jwt.sign(data as any, this.jwtSigningKey);
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
