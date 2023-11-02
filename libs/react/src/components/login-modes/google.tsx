import React from 'react';
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { loginWithGoogle } from "@/clients/identity.client";
// import { useReturnWithAccessToken } from "@/hooks/return.hook";
import { SocialLoginProps } from '../../types';
import { SocialLoginButton } from './social-login-button';
import { IconGoogle } from '../icons';
import { useStatus } from '../../contexts/status.context';
import { errorString } from '../../utils';
import { loginWithOAuth } from '../../requests/oauth';
import { usePersona } from '../../contexts/persona.context';

const GoogleLoginButtonInner: React.FC = () => {
  const { apiUrl } = usePersona();
  const { isFetching, setStatus } = useStatus();

  // const returnWithAccessToken = useReturnWithAccessToken();

  const handleGoogleLogin = useGoogleLogin({
    flow: "implicit",
    onNonOAuthError: () => setStatus(null),
    onSuccess: async (response) => {
      try {
        const accessToken = await loginWithOAuth(apiUrl, 'google', response.access_token);

        console.log(accessToken);

        // returnWithAccessToken(accessToken);
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
