import React from "react";
import { ReactFacebookLoginInfo, ReactFacebookFailureResponse } from "react-facebook-login";
import FacebookLoginButton from 'react-facebook-login/dist/facebook-login-render-props'
import { SocialLoginProps } from "../../types";
import { IconFacebook } from "../icons";
import { SocialLoginButton } from "./social-login-button";
import { useStatus } from "../../contexts/status.context";
import { errorString } from "../../utils";

export const FacebookLogin: React.FC<SocialLoginProps> = ({ credentials }) => {
  const { isFetching, setStatus } = useStatus();

  const handleLogin = async (userInfo: ReactFacebookLoginInfo | ReactFacebookFailureResponse) => {
    if (!!(userInfo as ReactFacebookFailureResponse).status) {
      setStatus("error", `There was an error: ${(userInfo as ReactFacebookFailureResponse).status}`);
    } else {
      const info = userInfo as ReactFacebookLoginInfo;
      console.log(info);

      try {
        // const accessToken = await loginWithFacebook({
        //   accessToken: info.accessToken,
        //   propertyId: property._id,
        // })

        // console.log(accessToken);
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
            try {
            onClick();
            } catch (e) {

            }
          }}
        />
      )}
    />
  )
}
