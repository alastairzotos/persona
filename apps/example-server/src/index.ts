import * as express from 'express';
import * as cors from 'cors';
import { config } from 'dotenv';
import { PersonaServer } from '@bitmetro/persona-node';
import { UserDetails } from '@bitmetro/persona-types';

config();

const app = express();
app.use(express.json());
app.use(cors())

interface User {
  _id: string;
  email: string;
  details: UserDetails;
}

const persona = new PersonaServer<User>({
  app,
  jwtSigningKey: process.env.JWT_SIGNING_KEY,
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

persona.on('get-user', (email) => Promise.resolve({ _id: '1234', email, details: { first_name: "alastair" } }))
persona.on('create-user', (email, details) => Promise.resolve({ _id: '1234', email, details }));

persona.start();

app.listen(3001, () => console.log("Example server running on http://localhost:3001"));

