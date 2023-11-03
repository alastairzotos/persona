import * as express from 'express';
import * as cors from 'cors';
import { config } from 'dotenv';
import { Persona } from '@bitmetro/persona-node';
import { MyAdapter } from './adapter';
import { User } from './mock-db';

config();

const app = express();
app.use(express.json());
app.use(cors())

const persona = new Persona<User>({
  adapter: new MyAdapter(),
  jwtSigningKey: process.env.JWT_SIGNING_KEY!,
  config: {
    emailPasswordConfig: {
      userDetails: ['first_name'],
    },
    credentials: {
      google: {
        id: process.env.GOOGLE_CLIENT_ID!,
        secret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      facebook: {
        id: process.env.FB_APP_ID!,
        secret: process.env.FB_APP_SECRET!,
      }
    }
  }
});

persona.setupExpress(app);

app.get('/secret', persona.authGuard, (req, res) => {
  console.log((req as any).principal);

  res.send("42")
})

// app.listen(3001, () => console.log("Example server running on http://localhost:3001"));
