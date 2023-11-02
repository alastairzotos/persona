import { Express } from 'express';
import { OAuthCredentials, OAuthProvider, PrivateConfig, PublicConfig, UserDetails } from '@bitmetro/persona-types';
import { CreateUserHandler, GetUserHandler, PersonaService, PersonaServiceHookType } from './services/persona-service';

interface Options {
  app: Express;
  jwtSigningKey: string;
  config: PrivateConfig;
}

export class PersonaServer<U extends any = any> {
  private app: Express;
  private config: PrivateConfig;
  private personaService: PersonaService<U>;

  constructor({
    app,
    jwtSigningKey,
    config
  }: Options) {
    this.app = app;
    this.config = config;

    this.personaService = new PersonaService(jwtSigningKey);

    this.start();
  }

  on(event: 'get-user', handler: GetUserHandler<U>): void;
  on(event: 'create-user', handler: CreateUserHandler<U>): void;
  on(event: PersonaServiceHookType, handler: Function): void {
    this.personaService.on(event, handler);
  }

  private start() {
    this.app.get('/persona/public-config', (req, res) => {
      res.json(this.getPublicConfig())
    })

    this.app.post('/persona/oauth/:provider',async (req, res) => {
      const provider = req.params.provider as OAuthProvider;
      const providerAccessToken = req.body.providerAccessToken as string;

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
