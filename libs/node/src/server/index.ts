import { Express, Request } from 'express';
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
  app: Express;
  jwtSigningKey: string;
  adapter: PersonaAdapter<U>;
  config: PrivateConfig;
}

export class PersonaServer<U extends BaseUserType = BaseUserType> {
  private app: Express;
  private config: PrivateConfig;
  private personaService: PersonaService<U>;

  constructor({
    app,
    adapter,
    jwtSigningKey,
    config
  }: Options<U>) {
    this.app = app;
    this.config = config;

    this.personaService = new PersonaService<U>(jwtSigningKey, adapter);
  }

  start() {
    this.app.get('/persona/public-config', (req, res) => {
      res.json(this.getPublicConfig())
    })

    this.app.post('/persona/register', async (req: Request<{}, {}, RegisterEmailPasswordDto>, res) => {
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

    this.app.post('/persona/login', async (req: Request<{}, {}, LoginEmailPasswordRequestDto>, res) => {
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

    this.app.post('/persona/oauth', async (req: Request<{}, {}, LoginOAuthRequestDto>, res) => {
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
