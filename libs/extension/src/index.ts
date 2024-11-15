import { AccessTokenResponse, BaseUserType, LoginEmailPasswordRequestDto, LoginMode, OAuthProvider, PublicConfig, RegisterEmailPasswordDto, UserDetails } from "@bitmetro/persona-types";
import * as jwt from 'jsonwebtoken';

type OAuthProviderInfo = {
  authUrl: string;
  scope: string;
}

const providerInfo: Record<OAuthProvider, OAuthProviderInfo> = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'openid profile email',
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
    scope: 'email,public_profile',
  },
};

const LOCAL_STORAGE_KEY = '@bitmetro/persona-key';

export class PersonaExtension<U extends BaseUserType = BaseUserType> {
  private publicConfig?: PublicConfig;
  private accessToken: string | null = null;
  private loggedInUser: U | null = null;

  constructor(
    private apiUrl: string,
  ) {
    this.accessToken = localStorage.getItem(LOCAL_STORAGE_KEY);
    this.loggedInUser = this.getUserFromAccessToken();
  }

  isReady() {
    return !!this.publicConfig;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getLoggedInUser() {
    return this.loggedInUser;
  }

  async init() {
    try {
      this.publicConfig = await this.fetchConfig(this.apiUrl);
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  }

  getLoginModes(): LoginMode[] {
    const modes: LoginMode[] = [];

    if (!this.publicConfig) {
      this.throwNotConfigured();
      return [];
    }

    if (this.publicConfig.emailPasswordConfig) {
      modes.push('email-password');
    }

    modes.push(...Object.keys(this.publicConfig.credentials) as OAuthProvider[]);

    return modes;
  }

  logout() {
    this.accessToken = null;
    this.loggedInUser = null;
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  async registerEmailPassword(email: string, password: string, details: UserDetails) {
    if (!this.publicConfig) {
      return this.throwNotConfigured();
    }

    if (!this.publicConfig.emailPasswordConfig) {
      throw new Error('Email and password logins are not enabled in the backend Persona configuration');
    }

    const response = await fetch(`${this.apiUrl}/persona/register?storage=localstorage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, details } as RegisterEmailPasswordDto),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const { accessToken } = await response.json() as AccessTokenResponse;

    this.loginWithAccessToken(accessToken);
    return this.loggedInUser;
  }

  async loginEmailPassword(email: string, password: string) {
    if (!this.publicConfig) {
      return this.throwNotConfigured();
    }

    if (!this.publicConfig.emailPasswordConfig) {
      throw new Error('Email and password logins are not enabled in the backend Persona configuration');
    }

    const response = await fetch(`${this.apiUrl}/persona/login?storage=localstorage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password } as LoginEmailPasswordRequestDto),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const { accessToken } = await response.json() as AccessTokenResponse;

    this.loginWithAccessToken(accessToken);
    return this.loggedInUser;
  }

  async handleOAuthLogin(provider: OAuthProvider) {
    return new Promise<U | null>((resolve) => {
      const authUrl = this.getAuthUrl(provider);

      chrome.identity.launchWebAuthFlow(
        { url: authUrl, interactive: true },
        async (redirectUrl) => {
          if (chrome.runtime.lastError || !redirectUrl) {
            console.error('OAuth failed:', chrome.runtime.lastError);
            return;
          }

          const urlParams = new URLSearchParams(new URL(redirectUrl).search);
          const code = urlParams.get('code');

          if (code) {
            const accessToken = await this.exchangeCodeForToken(provider, code);

            if (accessToken) {
              this.loginWithAccessToken(accessToken);
              resolve(this.loggedInUser);
            }
          }
        }
      )
    })
  }

  private loginWithAccessToken(accessToken: string) {
    this.accessToken = accessToken;
    localStorage.setItem(LOCAL_STORAGE_KEY, accessToken);
    this.loggedInUser = this.getUserFromAccessToken();
  }

  private getUserFromAccessToken(): U | null {
    if (this.accessToken) {
      return jwt.decode(this.accessToken) as U;
    }

    return null;
  }

  private async exchangeCodeForToken(provider: OAuthProvider, code: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.apiUrl}/persona/auth/callback/${provider}?code=${code}&state=localstorage&redirect_uri=${this.getRedirectUri()}`);
      const data = await response.json() as AccessTokenResponse;

      return data.accessToken;
    } catch (error) {
      console.error('Token exchange failed:', error);
      return null;
    }
  }

  private getAuthUrl(provider: OAuthProvider) {
    if (!this.publicConfig) {
      this.throwNotConfigured();
    }

    const { authUrl, scope } = providerInfo[provider];
    const clientId = this.publicConfig!.credentials[provider]!.id;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: this.getRedirectUri(),
      response_type: 'code',
      scope,
    });

    return `${authUrl}?${params.toString()}`;
  }

  private getRedirectUri() {
    return `https://${chrome.runtime.id}.chromiumapp.org/`;
  }

  private async fetchConfig(apiUrl: string): Promise<PublicConfig> {
    const res = await fetch(`${apiUrl}/persona/public-config`);
    return await res.json();
  }

  private throwNotConfigured() {
    throw new Error('Not configured. Please call persona.init()');
  }
}
