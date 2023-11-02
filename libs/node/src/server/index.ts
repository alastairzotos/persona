import { Express } from 'express';
import { OAuthCredentials, OAuthProvider, PrivateConfig, PublicConfig } from '@bitmetro/persona-types';
import { BaseUserType, PersonaAdapter } from '../adapters';
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
