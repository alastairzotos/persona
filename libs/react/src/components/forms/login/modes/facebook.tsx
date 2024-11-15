import React from "react";
import { IconFacebook } from "../../../icons";
import { SocialLoginButton } from "../../../primitives/social-login-button";
import { useConfig } from "../../../../contexts/config.context";

export const FacebookLogin: React.FC = () => {
  const { apiUrl } = useConfig();

  return (
    <SocialLoginButton
      title="Sign in with Facebook"
      icon={<IconFacebook />}
      onClick={() => window.location.href = `${apiUrl}/persona/auth/facebook?storage=cookie`}
    />
  )
}
