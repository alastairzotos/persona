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
  const { loggedInUser, logout, revalidate } = usePersona<User>();
  const [secretData, setSecretData] = useState('');

  const handleRequestClick = async () => {
    setSecretData(await fetchSecretData());
  }

  return (
    <div>
      {
        loggedInUser
          ? <p>Hello {loggedInUser.firstName} (Random thing: {loggedInUser.randomThing})</p>
          : <p>Hello stranger</p>
      }

      <LoginForm fwdUrl="/forward-page" registerState="user-admin" />

      <Button className='mt-8' onClick={logout}>Logout</Button>

      <Button className='mt-8' onClick={handleRequestClick}>Request</Button>

      <Button className='mt-8' onClick={revalidate}>Revalidate</Button>
      <p>Secret data: {secretData}</p>
    </div>
  )
}
