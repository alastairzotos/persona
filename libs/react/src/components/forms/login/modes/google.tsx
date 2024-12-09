import React from 'react';
import { SocialLoginButton } from '../../../primitives/social-login-button';
import { IconGoogle } from '../../../icons';
import { useConfig } from '../../../../contexts/config.context';
import { LoginProps } from '../../../../models';

export const GoogleLogin: React.FC<LoginProps> = ({ fwdUrl }) => {
  const { apiUrl } = useConfig();

  return (
    <SocialLoginButton
      title="Sign in with Google"
      icon={<IconGoogle />}
      onClick={() => window.location.href = `${apiUrl}/persona/auth/google?storage=cookie${fwdUrl ? `&fwdUrl=${fwdUrl}` : ''}`}
    />
  )
}
