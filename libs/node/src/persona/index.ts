import { Express, Request, RequestHandler, json } from 'express';
import {
  BaseUserType,
  LoginEmailPasswordRequestDto,
  LoginOAuthRequestDto,
  OAuthCredentials,
  PrivateConfig,
  PublicConfig,
  RegisterEmailPasswordDto
} from '@bitmetro/persona-types';

import { PersonaAdapter } from '../models';
import { PersonaService } from '../services/persona-service';

interface Options<U extends BaseUserType = BaseUserType> {
  adapter: PersonaAdapter<U>;
  jwtSigningKey: string;
  config: PrivateConfig;
}

export class Persona<U extends BaseUserType = BaseUserType> {
  private config: PrivateConfig;
  private personaService: PersonaService<U>;

  constructor({
    adapter,
    jwtSigningKey,
    config
  }: Options<U>) {
    this.config = config;

    this.personaService = new PersonaService<U>(jwtSigningKey, adapter);
  }

  async verifyAccessToken(accessToken: string) {
    return await this.personaService.verifyAccessToken(accessToken);
  }

  async authorize(request: Request): Promise<U | null> {
    if (!request.headers.authorization) {
      return null;
    }

    const [kind, accessToken] = request.headers.authorization.split(' ');

    if (kind !== 'Bearer' || !accessToken || accessToken === 'null') {
      return null;
    }

    const payload = await this.verifyAccessToken(accessToken);

    if (payload === 'invalid-token') {
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

  setupExpress(app: Express) {
    app.use(json());

    app.get('/persona/public-config', (req, res) => {
      res.json(this.getPublicConfig())
    })

    app.post('/persona/register', async (req: Request<{}, {}, RegisterEmailPasswordDto>, res) => {
      const {
        email,
        password,
        details,
      } = req.body;

      const result = await this.personaService.registerWithEmailPassword(email, password, details);

      if (result === 'existing-user') {
        return res.sendStatus(409);
      }

      res.json(result);
    })

    app.post('/persona/login', async (req: Request<{}, {}, LoginEmailPasswordRequestDto>, res) => {
      const { email, password } = req.body;

      const result = await this.personaService.loginEmailPassword(email, password);

      if (result === 'no-user') {
        return res.sendStatus(404);
      } else if (result === 'invalid-password') {
        return res.sendStatus(403);
      } else if (result === 'error') {
        return res.sendStatus(500);
      }

      res.json(result);
    })

    app.post('/persona/oauth', async (req: Request<{}, {}, LoginOAuthRequestDto>, res) => {
      const { provider, providerAccessToken } = req.body;

      const result = await this.personaService.loginOAuth(provider, providerAccessToken);

      if (result === 'invalid-token') {
        return res.sendStatus(401);
      } else if (result === 'error') {
        return res.sendStatus(500);
      }

      res.json(result);
    })
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
}
