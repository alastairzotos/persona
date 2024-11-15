import { PersonaExtension } from "@bitmetro/persona-extension";
import { LoginEmailPasswordForm } from "./login-email-password";

interface Props {
  persona: PersonaExtension<any>;
  onSuccess: (user: any) => void;
}

export const LoginForms: React.FC<Props> = ({ persona, onSuccess }) => {
  return (
    <div>
      {persona.getLoginModes().map(mode => (
        <div key={mode}>
          {mode === 'google' && (
            <div>
              <button onClick={async () => onSuccess(await persona.handleOAuthLogin('google'))}>Google login</button>
            </div>
          )}

          {mode === 'facebook' && (
            <div>
              <button onClick={async () => onSuccess(await persona.handleOAuthLogin('facebook'))}>Facebook login</button>
            </div>
          )}

          {mode === 'email-password' && (
            <>
              <p>Or with email + password</p>
              <LoginEmailPasswordForm persona={persona} onSuccess={onSuccess}/>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
