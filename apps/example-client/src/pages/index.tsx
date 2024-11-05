import { Button } from '@/components';
import { User } from '@/types';
import { LoginForm, getAccessToken, usePersona } from '@bitmetro/persona-react';
import { useState } from 'react';

const fetchSecretData = async () => {
  const res = await fetch('http://localhost:3001/secret', {
    credentials: 'include'
  });

  return await res.text();
}

const checkAuthStatus = async () => {
  const res = await fetch('http://localhost:3001/persona/status', {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`
    },
    credentials: 'include'
  });

  const data = await res.json();

  console.log(data);
}

const logout = async () => {
  await fetch('http://localhost:3001/persona/logout', {
    method: 'POST',
    credentials: 'include'
  });
}

export default function Home() {
  const { loggedInUser } = usePersona<User>();
  const [secretData, setSecretData] = useState('');

  const handleRequestClick = async () => {
    setSecretData(await fetchSecretData());
  }

  return (
    <div>
      {/* {
        loggedInUser
        ? <p>Hello {loggedInUser.firstName}{' '}<a onClick={logout}>Logout</a></p>
        : <LoginForm />
      } */}

      <LoginForm />

      <Button className='mt-8' onClick={logout}>Logout</Button>

      <Button className='mt-8' onClick={handleRequestClick}>Request</Button>
      <p>Secret data: {secretData}</p>

      <Button className='mt-8' onClick={checkAuthStatus}>Check status</Button>
    </div>
  )
}
