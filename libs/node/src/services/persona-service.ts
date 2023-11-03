import { AccessTokenResponse, BaseUserType, OAuthProvider, UserDetails } from '@bitmetro/persona-types';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { GoogleOAuthProvider } from '../providers/google';
import { FacebookOAuthProvider } from '../providers/facebook';
import { mapRecord } from '../utils';
import { PersonaAdapter, OAuthVerifier } from '../models';

const providers: Record<OAuthProvider, OAuthVerifier> = {
  google: new GoogleOAuthProvider(),
  facebook: new FacebookOAuthProvider(),
}

export class PersonaService<U extends BaseUserType = BaseUserType> {
  constructor(
    private jwtSigningKey: string,
    private adapter: PersonaAdapter<U>,
  ) { }

  async registerWithEmailPassword(email: string, password: string, details: UserDetails): Promise<AccessTokenResponse | 'existing-user'> {
    const existing = await this.adapter.getUserByEmail(email);

    if (!!existing) {
      return 'existing-user';
    }

    const user = await this.adapter.createUserWithPasswordHash(email, details, await this.hashPassword(password));

    return {
      accessToken: this.generateAccessToken(user)
    }
  }

  async loginEmailPassword(email: string, password: string): Promise<AccessTokenResponse | 'no-user' | 'invalid-password' | 'error'> {
    const user = await this.adapter.getUserByEmail(email);

    if (!user) {
      return 'no-user';
    }

    if (!await this.comparePasswords(password, await this.adapter.getUserPasswordHash(user) || '')) {
      return 'invalid-password';
    }

    return {
      accessToken: this.generateAccessToken(user)
    }
  }

  async loginOAuth(provider: OAuthProvider, providerAccessToken: string): Promise<AccessTokenResponse | 'invalid-token' | 'error'> {
    const details = await providers[provider].verifyAccessToken(providerAccessToken);

    if (!details) {
      return 'invalid-token';
    }

    const { email, userDetails } = details;

    let user = await this.adapter.getUserByEmail(email);

    if (!user) {
      user = await this.adapter.createUser(
        email,
        mapRecord(userDetails as Record<string, string>, (value) => value?.trim())
      );
    }

    if (!user) {
      return 'error';
    }

    return {
      accessToken: this.generateAccessToken(user),
    }
  }

  private generateAccessToken(data: U): string {
    return jwt.sign(data as any, this.jwtSigningKey);
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  private async comparePasswords(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
