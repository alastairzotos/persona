import * as express from 'express';
import * as cors from 'cors';
import { config } from 'dotenv';
import { PersonaServer } from '@bitmetro/persona-node';
import { MyAdapter, User } from './adapter';

config();

const app = express();
app.use(express.json());
app.use(cors())



const persona = new PersonaServer<User>({
  app,
  jwtSigningKey: process.env.JWT_SIGNING_KEY,
  adapter: new MyAdapter(),
  config: {
    emailPasswordConfig: {
      userDetails: [],
    },
    credentials: {
      google: {
        id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
      },
      facebook: {
        id: process.env.FB_APP_ID,
        secret: process.env.FB_APP_SECRET,
      }
    }
  }
});

persona.start();

app.listen(3001, () => console.log("Example server running on http://localhost:3001"));

