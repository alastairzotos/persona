import React from 'react';

import { EmailPasswordLogin } from './email-password';

import { StatusProvider } from '../../../contexts/status.context';
import { useFetchConfig } from '../../../hooks';
import { LoginProps } from '../../../models';
import { Wrapper } from '../../wrapper';
import { OAuthButtons } from '../oauth/buttons';

export const LoginForm: React.FC<LoginProps> = (props) => {
  const { config, isFetchingConfig } = useFetchConfig();

  if (!config || isFetchingConfig) {
    return <p>Loading...</p>;
  }

  return (
    <StatusProvider>
      <Wrapper>
        <OAuthButtons {...props} config={config} />

        {!!config.emailPasswordConfig && (
          <EmailPasswordLogin
            {...props}
            showPrompt={!!config.credentials && Object.keys(config.credentials).length > 0}
          />
        )}
      </Wrapper>
    </StatusProvider>
  )
}
