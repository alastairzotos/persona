import { useState } from 'react';
import { PersonaExtension } from "@bitmetro/persona-extension";

interface Props {
  persona: PersonaExtension<any>;
  onSuccess: (user: any) => void;
}

export const LoginEmailPasswordForm: React.FC<Props> = ({ persona, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      onSuccess(await persona.loginEmailPassword(email, password));
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }
  }

  return (
    <div>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} /> <br />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} /> <br />

      <button onClick={handleLogin}>Login</button>

      {error && <p>{error}</p>}
    </div>
  )
}
