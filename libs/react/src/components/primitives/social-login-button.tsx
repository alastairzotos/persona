import styled from 'styled-components'
import React from "react";
import { Button } from './button';

interface Props {
  title: string;
  icon?: React.ReactElement;
  onClick: () => void;
  disabled?: boolean;
}

const LoginButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.pad * 3,
}))

export const SocialLoginButton: React.FC<Props> = ({ title, icon, onClick, disabled }) => {
  return (
    <LoginButton
      variant="contained"
      onClick={onClick}
      disabled={disabled}
    >
      {icon} {title}
    </LoginButton>
  )
}
