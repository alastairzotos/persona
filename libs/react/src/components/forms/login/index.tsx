import React from 'react';
import { OAuthProvider } from '@bitmetro/persona-types';

import { EmailPasswordLogin } from './modes/email-password';
import { GoogleLogin } from './modes/google';
import { FacebookLogin } from './modes/facebook';

import { Wrapper } from '../../wrapper';
import { useFetchConfig } from '../../../hooks';
import { StatusProvider } from '../../../contexts/status.context';

interface Props {
  fwdUrl?: string;
}

export const LoginForm: React.FC<Props> = ({ fwdUrl }) => {
  const { config, isFetchingConfig } = useFetchConfig();
  const encodedFwdUrl = fwdUrl ? encodeURIComponent(fwdUrl) : undefined;

  if (!config || isFetchingConfig) {
    return <p>Loading...</p>;
  }

  const credentialButton: Record<OAuthProvider, React.FC> = {
    google: GoogleLogin,
    facebook: FacebookLogin,
  }

  return (
    <StatusProvider>
      <Wrapper>
        {Object.keys(config.credentials).map((provider) => {
          const Component = credentialButton[provider as OAuthProvider];

          return <Component key={provider} />;
        })}

        {!!config.emailPasswordConfig && (
          <EmailPasswordLogin
            fwdUrl={encodedFwdUrl}
            showPrompt={!!config.credentials && Object.keys(config.credentials).length > 0}
          />
        )}
      </Wrapper>
    </StatusProvider>
  )
}
