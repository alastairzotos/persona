import { User } from '@/types';
import { LoginForm, getAccessToken, usePersona } from '@bitmetro/persona-react';

export default function Home() {
  const { loggedInUser, logout } = usePersona<User>();

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

      <button className='mt-8' onClick={() => console.log(getAccessToken())}>Request</button>
    </div>
  )
}
