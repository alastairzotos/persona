# <img src="https://phrase-gen.bitmetro.io/bm-logo-new-white.png" width="30" height="30" alt="BitMetro Logo" /> Persona - React/Express authentication made easy

Persona provides packages for you to integrate authentication easily into your React/Express application with minimal effort. It provides authentication methods for Google, Facebook, and email/password.

### Own your data

By providing custom adapters you can easily define how users are created and retrieved from your database. Persona is unopinionated and doesn't care what your data looks like, how it's stored or retrieved, or even what database engine you use.

### Zero-hastle configuration

Declare your configs server side and let the Login and Registration forms take shape automatically. Simply state which login methods you wish to use, provide the credentials, and the rest will take care of itself.

### Installation

For express, run:
```sh
npm i @bitmetro/persona-node
```

For React, run:
```sh
npm i @bitmetro/persona-react
```

### Express example

Setting up Persona on the server-side is easy:

##### Setup

```ts
const app = express();
app.use(express.json());
app.use(cors())

const persona = new Persona<User>({
  adapter: new MyAdapter(),
  jwtSigningKey: process.env.JWT_SIGNING_KEY, // Anything long and unguessable
  config: {
    emailPasswordConfig: {
      userDetails: ['first_name'], // Will ask the user for their name when they register  with email/password
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

persona.setupExpress(app);
```

> **Note**: If we don't provide credentials for `facebook` then the user will not see a *"Sign in with Facebook"* button. Simple!
> **Note**: We can provide our user type as a type parameter too. This is so we can type the user object when we authenticate them (see [guarding](#guarding-endpoints))

##### Simple adapter:

```ts
export class MyAdapter implements PersonaAdapter<User> {
  async getUserByEmail(email: string) {
    // Important! Don't return passwords with the users
    // Though passwords are hashed it's still bad practice to expose them
    return await db.getUserByEmail(email);
  }

  async createUser(email: string, details: Partial<Record<UserDetail, string>>) {
    return await db.createUser({ email, firstName: details.first_name! });
  }
}
```
> **Note**: We can strongly type our users by providing type arguments

If we also want to use email/password logins and registrations, we have to work with passwords:
```ts
  async createUserWithPasswordHash(email: string, details: Partial<Record<UserDetail, string>>, passwordHash: string) {
    return await db.createUser({
      email,
      firstName: details.first_name!,
      passwordHash,
    })
  }

  async getUserPasswordHash(user: User) {
    const found = await db.getUserByEmailWithPasswordHash(user.email);

    return found?.passwordHash;
  }
```

##### Guarding endpoints


```ts
app.get('/secret-endpoint', persona.authGuard, (req, res) => {
  console.log((req as any).principal); // Access our logged in user

  res.send("42")
})
```

> **Note**: The `persona.authGuard` middleware will prevent unauthorized access.
> If you want more granular control (for instance, if you're using a framework such as NestJS) you can also use `persona.authorize()` and `persona.verifyAccessToken()`

Notice we have access to `principal` in our request object. This is the user that made the request. The data contained is parsed from the json web token, but we can exchange it for a live object. We might want to do this to double check if the user exists in the database for example. Add `exchangeJwtPayloadForUser` to your adapter:
```ts
  async exchangeJwtPayloadForUser(payload: User) {
    return await this.getUserByEmail(payload.email);
  }
```

### React example

Adding Persona to your react app is as simple as wrapping it in a `<PersonaProvider />`. For example, in NextJS:

##### Setup

```tsx
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <PersonaProvider
      apiUrl={...}
      onRegister={() => router.push('/register')}
      onLogin={() => router.push('/')}
      onLogout={() => router.push('/login')}
    >
      <Component {...pageProps} />
    </PersonaProvider>
  )
}
```

##### Forms

We can now provide login and registration forms easily:
```tsx
const LoginPage = () => {
  return (
    <LoginForm />
  )
}

const RegisterPage = () => {
  return (
    <RegisterForm />
  )
}
```

##### Logging in and out

If we wish to access the currently signed-in user:
```tsx
const { loggedInUser } = usePersona<User>();
```

> **Note**: We can strongly type our users

To logout:
```tsx
const { logout } = usePersona();

return (
  <button onClick={logout}>
    Logout
  </button>
)
```

##### Authenticating requests

And to authenticate our requests, we can use the `getAccessToken()` function to provide a Bearer token:
```ts
const fetchSecretData = async () => {
  const res = await fetch('http://localhost:3001/secret-endpoint', {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`
    }
  });

  return await res.text();
}
```

##### Theming

The login and registration form themes can be customised by providing a `theme` property to the `PersonaProvider`

```tsx
<PersonaProvider theme={extendPersonaTheme({ ... })}>
  ...
</PersonaProvider>
```
