import React from "react";
import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/react';

import { FormBox } from "./primitives";
import { useStatus } from "../contexts/status.context";

export const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { errorMessage } = useStatus();

  return (
    <FormBox>
      {children}

      {!!errorMessage && (
        <Alert status="error" mt={8}>
          <AlertIcon />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </FormBox>
  )
}