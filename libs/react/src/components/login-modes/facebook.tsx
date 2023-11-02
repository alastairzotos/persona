import React from "react";
import { ReactFacebookLoginInfo, ReactFacebookFailureResponse } from "react-facebook-login";
import FacebookLoginButton from 'react-facebook-login/dist/facebook-login-render-props'
import { SocialLoginProps } from "../../types";
import { IconFacebook } from "../icons";
import { SocialLoginButton } from "../primitives/social-login-button";
import { useStatus } from "../../contexts/status.context";
import { errorString } from "../../utils";
import { loginWithOAuth } from "../../requests/auth";
import { useConfig } from "../../contexts/config.context";
import { useSession } from "../../contexts/session.context";

export const FacebookLogin: React.FC<SocialLoginProps> = ({ credentials }) => {
  const { apiUrl } = useConfig();
  const { login } = useSession();
  const { isFetching, setStatus } = useStatus();

  const handleLogin = async (userInfo: ReactFacebookLoginInfo | ReactFacebookFailureResponse) => {
    if (!!(userInfo as ReactFacebookFailureResponse).status) {
      setStatus("error", `There was an error: ${(userInfo as ReactFacebookFailureResponse).status}`);
    } else {
      const info = userInfo as ReactFacebookLoginInfo;

      try {
        const { accessToken } = await loginWithOAuth(apiUrl, 'facebook', info.accessToken);
        
        login(accessToken);

        setStatus("success");
      } catch (e) {
        setStatus("error", errorString(e))
      }
    }
  }

  return (
    <FacebookLoginButton
      appId={credentials.id}
      callback={handleLogin}
      onFailure={() => setStatus(null)}

      render={({ onClick }) => (
        <SocialLoginButton
          title="Sign in with Facebook"
          icon={<IconFacebook />}
          disabled={isFetching}
          onClick={() => {
            setStatus('fetching');
            onClick();
          }}
        />
      )}
    />
  )
}
