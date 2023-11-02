import { AccessTokenResponse, OAuthProvider, UserDetail, UserDetails } from '@bitmetro/persona-types';
import * as jwt from 'jsonwebtoken';
import { OAuthVerifier } from '../providers/models';
import { GoogleOAuthProvider } from '../providers/google';
import { FacebookOAuthProvider } from '../providers/facebook';
import { mapRecord } from '../utils';
import { BaseUserType, PersonaAdapter } from '../adapters/models';

const providers: Record<OAuthProvider, OAuthVerifier> = {
  google: new GoogleOAuthProvider(),
  facebook: new FacebookOAuthProvider(),
}



export class PersonaService<U extends BaseUserType = BaseUserType> {
  constructor(
    private jwtSigningKey: string,
    private adapter: PersonaAdapter<U>,
  ) {}

  async loginOAuth(provider: OAuthProvider, providerAccessToken: string): Promise<AccessTokenResponse | 'invalid-token' | 'error'> {
    const details = await providers[provider].verifyAccessToken(providerAccessToken, []);

    if (!details) {
      return 'invalid-token';
    }

    const { email, userDetails } = details;

    let user = await this.adapter.getUser(email);

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
}
