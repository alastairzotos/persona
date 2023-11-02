import React from 'react';
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { SocialLoginProps } from '../../types';
import { SocialLoginButton } from '../primitives/social-login-button';
import { IconGoogle } from '../icons';
import { useStatus } from '../../contexts/status.context';
import { errorString } from '../../utils';
import { loginWithOAuth } from '../../requests/auth';
import { useConfig } from '../../contexts/config.context';
import { useSession } from '../../contexts/session.context';

const GoogleLoginButtonInner: React.FC = () => {
  const { apiUrl } = useConfig();
  const { login } = useSession();
  const { isFetching, setStatus } = useStatus();

  const handleGoogleLogin = useGoogleLogin({
    flow: "implicit",
    onNonOAuthError: () => setStatus(null),
    onSuccess: async (response) => {
      try {
        const { accessToken } = await loginWithOAuth(apiUrl, 'google', response.access_token);

        login(accessToken);

        setStatus("success");
      } catch (e) {
        setStatus("error", errorString(e))
      }
    },
  });

  return (
    <SocialLoginButton
      title="Sign in with Google"
      icon={<IconGoogle />}
      disabled={isFetching}
      onClick={() => {
        setStatus("fetching");
        handleGoogleLogin();
      }}
    />
  )
}

export const GoogleLogin: React.FC<SocialLoginProps> = (props) => {
  return (
    <GoogleOAuthProvider clientId={props.credentials.id}>
      <GoogleLoginButtonInner />
    </GoogleOAuthProvider>
  )
}
