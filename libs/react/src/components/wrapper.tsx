import React from "react";

import { FormBox } from "./primitives";
import { useStatus } from "../contexts/status.context";
import { Alert } from "./primitives/alert";

export const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { errorMessage } = useStatus();

  return (
    <FormBox>
      {children}

      {!!errorMessage && (
        <Alert>{errorMessage}</Alert>
      )}
    </FormBox>
  )
}
