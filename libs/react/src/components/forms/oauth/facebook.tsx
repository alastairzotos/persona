import React from "react";
import { IconFacebook } from "../../icons";
import { SocialLoginButton } from "../../primitives/social-login-button";
import { useConfig } from "../../../contexts/config.context";
import { LoginProps } from "../../../models";
import { oauthLoginParams } from "../../../utils";

export const FacebookLogin: React.FC<LoginProps> = (props) => {
  const { apiUrl } = useConfig();

  return (
    <SocialLoginButton
      title="Sign in with Facebook"
      icon={<IconFacebook />}
      onClick={() => window.location.href = `${apiUrl}/persona/auth/facebook?storage=cookie${oauthLoginParams(props)}`}
    />
  )
}
