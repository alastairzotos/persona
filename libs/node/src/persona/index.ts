import { Express, Request, Response, RequestHandler, json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {
  AccessTokenResponse,
  BaseUserType,
  TokenStorageMethod,
  LoginEmailPasswordRequestDto,
  OAuthCredentials,
  OAuthProvider,
  PrivateConfig,
  PublicConfig,
  RegisterEmailPasswordDto
} from '@bitmetro/persona-types';

import { PersonaAdapter } from '../models';
import { PersonaService } from '../services/persona-service';

interface Options<U extends BaseUserType = BaseUserType> {
  host: string;
  clientUrls?: string[];
  adapter: PersonaAdapter<U>;
  jwtSigningKey: string;
  config: PrivateConfig;
}

export class Persona<U extends BaseUserType = BaseUserType> {
  private host: string;
  private clientUrls?: string[];
  private config: PrivateConfig;
  private personaService: PersonaService<U>;

  constructor({
    host,
    clientUrls,
    adapter,
    jwtSigningKey,
    config
  }: Options<U>) {
    this.host = host;
    this.clientUrls = clientUrls;
    this.config = config;

    this.personaService = new PersonaService<U>(jwtSigningKey, adapter);
  }

  async verifyAccessToken(accessToken: string) {
    return await this.personaService.verifyAccessToken(accessToken);
  }

  async authorize(request: Request): Promise<U | null> {
    let accessToken = request.cookies.token as string;

    if (!accessToken) {
      const authHeader = (request.headers.authorization || request.headers.authentication) as string;

      if (!authHeader) {
        return null;
      }

      const [kind, token] = authHeader.split(' ');

      if (kind !== 'Bearer' || !token || token === 'null') {
        return null;
      }

      accessToken = token;
    }

    const payload = await this.verifyAccessToken(accessToken);

    if (payload === 'invalid-token' || payload === 'user-not-found') {
      return null;
    }

    (request as any).principal = payload;

    return payload;
  }

  authGuard: RequestHandler = async (req, res, next) => {
    const payload = await this.authorize(req);

    if (!payload) {
      return res.sendStatus(401);
    }

    next();
  }

  async verifyPassword(password: string, hashedPassword: string) {
    return await this.personaService.comparePasswords(password, hashedPassword);
  }

  setupExpress(app: Express) {
    app.use(json());
    app.use(cookieParser());
    app.use(cors({
      credentials: true,
      origin: (origin, cb) => {
        if (!origin || this.clientUrls?.includes(origin)) {
          cb(null, true);
        } else {
          cb(new Error('CORS error'));
        }
      }
    }));

    app.get('/persona/public-config', (req, res) => {
      res.json(this.getPublicConfig())
    })

    app.post('/persona/register', async (req: Request<{}, {}, RegisterEmailPasswordDto>, res) => {
      const {
        email,
        password,
        details,
      } = req.body;

      const storageMethod = req.query.storage as TokenStorageMethod || 'cookie';

      const loginResult = await this.personaService.registerWithEmailPassword(email, password, details);

      if (loginResult === 'existing-user') {
        return res.status(409).send("User already exists");
      } else if (loginResult === 'no-create-method') {
        return res.status(501).send("Missing user registration implementation");
      }

      this.loginSuccess(storageMethod, loginResult, res);
    })

    app.post('/persona/login', async (req: Request<{}, {}, LoginEmailPasswordRequestDto>, res) => {
      const { email, password } = req.body;
      const storageMethod = req.query.storage as TokenStorageMethod || 'cookie';

      const loginResult = await this.personaService.loginEmailPassword(email, password);

      if (loginResult === 'no-user' || loginResult === 'invalid-password') {
        return res.status(403).send("Invalid user or password");
      } else if (loginResult === 'no-pwd-hash-method') {
        return res.status(404).send("Missing 'getUserPasswordHash' method in adapter");
      }

      this.loginSuccess(storageMethod, loginResult, res);
    })

    app.get('/persona/status', this.authGuard, async (req, res) => {
      res.json({ loggedIn: true, user: (req as any).principal });
    })

    app.post('/persona/logout', async (_, res) => {
      res.cookie('token', '', { httpOnly: true, maxAge: 0 }).sendStatus(200);
    })

    app.get('/persona/auth/callback/:provider', async (req, res: Response) => {
      const code = req.query.code as string;
      const storageMethod = req.query.state as TokenStorageMethod || 'cookie';
      const redirectUri = req.query.redirect_uri as string | undefined;

      const provider = req.params.provider as OAuthProvider;
      const credentials = this.config.credentials[provider];

      if (!code) {
        return res.status(400).send('Missing code');
      }

      if (!credentials) {
        return res.status(400).send('Missing credentials');
      }

      try {
        const loginResult = await this.personaService.exchangeOAuthCodeForJwt(provider, code, credentials, redirectUri || this.buildRedirectUri(provider));

        switch (loginResult) {
          case 'create-user-error':
            return res.status(500).send("Error creating account");

          case 'invalid-token':
            return res.status(401).send("Invalid OAuth access token");

          case 'login-error':
            return res.status(500).send("OAuth error");

          default:
            this.loginSuccess(storageMethod, loginResult, res, true);
        }
      } catch (e) {
        console.error(e);
        res.status(500).send('Authorisation failed');
      }
    })

    app.get('/persona/auth/:provider', async (req, res) => {
      const provider = req.params.provider as OAuthProvider;
      const storageMethod = req.query.storage as TokenStorageMethod || 'cookie';
      const clientId = this.config.credentials[provider]?.id!;
      const redirectUri = req.query.redirect_uri as string | undefined;

      const authUrl = this.personaService.getOAuthProviderLoginUrl(provider, storageMethod, clientId, redirectUri || this.buildRedirectUri(provider));

      res.redirect(authUrl);
    });
  }

  private loginSuccess(storageMethod: TokenStorageMethod, loginResult: AccessTokenResponse, res: Response, redirect = false) {
    if (storageMethod === 'cookie') {
      res.cookie('token', loginResult.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'none',
      });

      if (redirect) {
        if (!this.clientUrls || this.clientUrls?.length === 0) {
          return res.status(500).send('No frontendUrl provided');
        }

        res.redirect(this.clientUrls[0]);
      } else {
        res.send('Logged in');
      }
    } else {
      res.json(loginResult);
    }
  }

  private getPublicConfig(): PublicConfig {
    return {
      ...this.config,
      credentials: Object.entries(this.config.credentials)
        .reduce<OAuthCredentials<true>>((acc, [provider, creds]) => ({
          ...acc,
          [provider]: { id: creds.id }
        }), {})
    }
  }

  private buildRedirectUri(provider: OAuthProvider) {
    return `${this.host}/persona/auth/callback/${provider}`;
  }
}
