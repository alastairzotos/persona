import { User } from '@/types';
import { LoginForm, getAccessToken, usePersona } from '@bitmetro/persona-react';
import { useState } from 'react';

const fetchSecretData = async () => {
  const res = await fetch('http://localhost:3001/secret', {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`
    }
  });

  return await res.text();
}

export default function Home() {
  const { loggedInUser, logout } = usePersona<User>();
  const [secretData, setSecretData] = useState('');

  const handleRequestClick = async () => {
    setSecretData(await fetchSecretData());
  }

  return (
    <div className="flex flex-col">
      {
        loggedInUser
        ? (
          <>
            <p>Hello {loggedInUser.firstName}</p>
            <button onClick={logout}>Logout</button>
          </>
        )
        : <LoginForm />
      }

      <button className='mt-8' onClick={handleRequestClick}>Request</button>
      <p>Secret data: {secretData}</p>
    </div>
  )
}
