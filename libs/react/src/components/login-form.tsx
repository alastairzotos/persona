import React from 'react';
import { OAuthProvider } from '@bitmetro/persona-types';
import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';

import { fetchConfig } from '../requests/config';
import { useConfig } from '../contexts/config.context';
import { EmailPasswordLogin } from './login-modes/email-password';
import { GoogleLogin } from './login-modes/google';
import { FacebookLogin } from './login-modes/facebook';
import { SocialLoginProps } from '../types';
import { useStatus } from '../contexts/status.context';
import { FormBox } from './primitives';

export const LoginForm: React.FC = () => {
  const { apiUrl } = useConfig();
  const { errorMessage } = useStatus();

  const { data: config, isFetching, error } = useQuery({
    queryKey: ['config'],
    queryFn: () => fetchConfig(apiUrl),
  });

  if (!config || isFetching) {
    return <p>Loading...</p>;
  }

  const credentialButton: Record<OAuthProvider, React.FC<SocialLoginProps>> = {
    google: props => <GoogleLogin {...props} />,
    facebook: props => <FacebookLogin {...props} />,
  }

  return (
    <FormBox>
      {Object.entries(config.credentials).map(([provider, credentials]) => {
        const Component = credentialButton[provider as OAuthProvider];

        return <Component key={provider} credentials={credentials} />;
      })}

      {!!config.emailPasswordConfig && (
        <EmailPasswordLogin
          showPrompt={!!config.credentials && Object.keys(config.credentials).length > 0}
        />
      )}

      {!!errorMessage && (
        <Alert status="error" mt={8}>
          <AlertIcon />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </FormBox>
  )
}
