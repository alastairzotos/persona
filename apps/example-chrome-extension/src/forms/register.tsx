import { useState } from 'react';
import { PersonaChrome } from "@bitmetro/persona-chrome";

interface Props {
  persona: PersonaChrome<any>;
  onSuccess: (user: any) => void;
  onCancel: () => void;
}

export const RegisterForm: React.FC<Props> = ({ persona, onSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} /> <br />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} /> <br />

      <button onClick={onCancel}>Cancel</button>
      <button onClick={async () => onSuccess(await persona.registerEmailPassword(email, password, { first_name: 'Testname' }))}>Register</button>
    </div>
  )
}
