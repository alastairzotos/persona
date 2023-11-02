import { AccessTokenResponse, OAuthProvider, UserDetail, UserDetails } from '@bitmetro/persona-types';
import * as jwt from 'jsonwebtoken';
import { OAuthVerifier } from '../providers/models';
import { GoogleOAuthProvider } from '../providers/google';
import { FacebookOAuthProvider } from '../providers/facebook';
import { mapRecord } from '../utils';

const providers: Record<OAuthProvider, OAuthVerifier> = {
  google: new GoogleOAuthProvider(),
  facebook: new FacebookOAuthProvider(),
}

export type BaseUserType = object;

export type PersonaServiceHookType = 'get-user' | 'create-user';
export type GetUserHandler<U extends BaseUserType = BaseUserType> = (email: string) => Promise<U>;
export type CreateUserHandler<U extends BaseUserType = BaseUserType> =  (email: string, details: UserDetails) => Promise<U>;

export class PersonaService<U extends BaseUserType = BaseUserType> {
  private getUser?: GetUserHandler<U>;
  private createUser?: CreateUserHandler<U>;

  constructor(
    private jwtSigningKey: string,
  ) {}

  on(event: PersonaServiceHookType, handler: Function): void {
    switch (event) {
      case 'get-user':
        this.getUser = handler as GetUserHandler<U>;
        break;

      case 'create-user':
        this.createUser = handler as CreateUserHandler<U>;
        break;
    }
  }

  async loginOAuth(provider: OAuthProvider, providerAccessToken: string): Promise<AccessTokenResponse | 'invalid-token' | 'error'> {
    const details = await providers[provider].verifyAccessToken(providerAccessToken, []);

    if (!details) {
      return 'invalid-token';
    }

    const { email, userDetails } = details;

    let user = await this.getUser?.(email);

    if (!user) {
      user = await this.createUser?.(
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
