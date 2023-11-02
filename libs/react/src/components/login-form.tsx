import React from 'react';
import { OAuthProvider } from '@bitmetro/persona-types';
import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/react';
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query';

import { fetchConfig } from '../requests/config';
import { usePersona } from '../contexts/persona.context';
import { EmailPasswordLogin } from './login-modes/email-password';
import { GoogleLogin } from './login-modes/google';
import { FacebookLogin } from './login-modes/facebook';
import { SocialLoginProps } from '../types';
import { useStatus } from '../contexts/status.context';

const Container = styled('div')({
  padding: 32,
  border: '1px solid #03728c',
  borderTop: '4px solid #03728c',
  borderRadius: 6
})

export const LoginForm: React.FC = () => {
  const { apiUrl } = usePersona();
  const { errorMessage } = useStatus();

  const { data, isFetching, error } = useQuery({
    queryKey: ['config'],
    queryFn: () => fetchConfig(apiUrl),
  });

  if (!data || isFetching) {
    return <p>Loading...</p>;
  }

  const credentialButton: Record<OAuthProvider, React.FC<SocialLoginProps>> = {
    google: props => <GoogleLogin {...props} />,
    facebook: props => <FacebookLogin {...props} />,
  }

  return (
    <Container>
      {Object.entries(data.credentials).map(([provider, credentials]) => (
        credentialButton[provider as OAuthProvider]({ credentials })
      ))}

      {!!data.emailPasswordConfig && (
        <EmailPasswordLogin
          showPrompt={!!data.credentials && Object.keys(data.credentials).length > 0}
        />
      )}

      {!!errorMessage && (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </Container>
  )
}
