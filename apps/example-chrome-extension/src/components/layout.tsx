import { LoginForm, RegisterForm, getAccessToken, usePersona } from "@bitmetro/persona-react";
import React from "react";
import { usePage } from "../contexts/page.context";

export interface User {
  _id: string;
  email: string;
  firstName: string;
}

export const Layout: React.FC = () => {
  const { page, setPage } = usePage();
  const { loggedInUser, logout } = usePersona<User>();

  return (
    <>
      {page === 'login' && <LoginForm />}
      {page === 'register' && <RegisterForm />}

      {page === 'home' && (
        <>
          <p>Hello {loggedInUser?.firstName || 'Stranger'}</p>
          {loggedInUser && <button onClick={() => logout()}>Logout</button>}
          {!loggedInUser && <button onClick={() => setPage('login')}>Login</button>}
        </>
      )}
    </>
  )
}

const fetchSecretData = async () => {
  const res = await fetch('http://localhost:3001/secret', {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`
    }
  });

  return await res.text();
}

// export default function Home() {
//   const { loggedInUser, logout } = usePersona<User>();
//   const [secretData, setSecretData] = useState('');

//   const handleRequestClick = async () => {
//     setSecretData(await fetchSecretData());
//   }

//   return (
//     <div>
//       {
//         loggedInUser
//           ? <p>Hello {loggedInUser.firstName}</p>
//           : <p>Hello stranger</p>
//       }

//       <LoginForm />

//       <Button className='mt-8' onClick={logout}>Logout</Button>

//       <Button className='mt-8' onClick={handleRequestClick}>Request</Button>
//       <p>Secret data: {secretData}</p>
//     </div>
//   )
// }
