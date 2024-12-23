import React from "react";
import { useFetchConfig } from "../../../hooks";
import { OAuthProvider, PublicConfig } from "@bitmetro/persona-types";
import { LoginProps } from "../../../models";
import { GoogleLogin } from "./google";
import { FacebookLogin } from "./facebook";

interface Props extends LoginProps {
  config: PublicConfig;
}

export const OAuthButtons: React.FC<Props> = (props) => {
  const credentialButton: Record<OAuthProvider, React.FC<LoginProps>> = {
    google: GoogleLogin,
    facebook: FacebookLogin,
  }

  return (
    <>
      {Object.keys(props.config.credentials).map((provider) => {
        const Component = credentialButton[provider as OAuthProvider];

        return <Component key={provider} {...props} />;
      })}
    </>
  )
}
