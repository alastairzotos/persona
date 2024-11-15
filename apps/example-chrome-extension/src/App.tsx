import { useEffect, useState } from 'react';
import { PersonaChrome } from '@bitmetro/persona-chrome';
import { LoginForms } from './forms/login';
import { RegisterForm } from './forms/register';

const persona = new PersonaChrome<{ _id: string }>('http://localhost:3001');

const fetchSecretData = async () => {
  const res = await fetch('http://localhost:3001/secret', {
    headers: {
      Authorization: `Bearer ${persona.getAccessToken()}`
    }
  });

  return await res.text();
}

function App() {
  const [registering, setRegistering] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [secretData, setSecretData] = useState('');

  useEffect(() => {
    persona.init()
    setUser(persona.getLoggedInUser());
  }, []);

  const handleLogout = () => {
    persona.logout();
    setUser(null);
  }

  const handleGetSecret = async () => {
    setSecretData(await fetchSecretData());
  }

  if (registering) {
    return (
      <RegisterForm
        persona={persona}
        onCancel={() => setRegistering(false)}
        onSuccess={(user) => {
          setUser(user);
          setRegistering(false);
        }}
      />
    )
  }

  return (
    <>
      <h3>Hello {user?.firstName || 'Stranger'}</h3>
      
      {persona.isReady() && !user && (
        <>
          <LoginForms persona={persona} onSuccess={setUser} />
          <button onClick={() => setRegistering(true)}>Register</button>
        </>
      )}

      {user && <button onClick={handleLogout}>Logout</button>}
      <br />
      <button onClick={handleGetSecret}>Get secret data</button>
      <p>Secret data: {secretData}</p>
    </>
  )
}

export default App
