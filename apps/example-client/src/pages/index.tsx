import { Button } from '@/components';
import { User } from '@/types';
import { LoginForm, usePersona } from '@bitmetro/persona-react';
import { useState } from 'react';

const fetchSecretData = async () => {
  const res = await fetch('http://localhost:3001/secret', {
    credentials: 'include'
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
    <div>
      {
        loggedInUser
          ? <p>Hello {loggedInUser.firstName}</p>
          : <p>Hello stranger</p>
      }

      <LoginForm />

      <Button className='mt-8' onClick={logout}>Logout</Button>

      <Button className='mt-8' onClick={handleRequestClick}>Request</Button>
      <p>Secret data: {secretData}</p>
    </div>
  )
}
