import { Button } from "@chakra-ui/react";
import styled from '@emotion/styled'
import React from "react";

interface Props {
  title: string;
  icon?: React.ReactElement;
  onClick: () => void;
  disabled?: boolean;
}

const LoginButton = styled(Button)({
  padding: 24,
  marginBottom: 12,
  width: '100%',
})

export const SocialLoginButton: React.FC<Props> = ({ title, icon, onClick, disabled }) => {
  return (
    <LoginButton
      onClick={onClick}
      isDisabled={disabled}
      leftIcon={icon}
    >
      {title}
    </LoginButton>
  )
}
