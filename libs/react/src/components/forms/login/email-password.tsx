import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import styled from 'styled-components'
import { LoginEmailPasswordSchema, loginEmailPasswordSchema } from "../../../schemas";
import { useStatus } from "../../../contexts/status.context";
import { loginEmailPassword } from "../../../requests/auth";
import { useConfig } from "../../../contexts/config.context";
import { Button, Container } from "../../primitives";
import { useSession } from "../../../contexts/session.context";
import { useAttempt } from "../../../hooks";
import { FormErrorMessage, Input } from "../../primitives/forms";
import { LoginProps } from "../../../models";

const PromptContainer = styled('div')(({ theme }) => ({
  color: theme.textColor,
  textAlign: 'center',
  paddingTop: theme.pad * 2,
  paddingBottom: theme.pad * 2,
  fontSize: '0.9rem',
}))

const LoginButton = styled(Button)({
  marginTop: 12,
})

interface Props extends LoginProps {
  showPrompt: boolean;
}

export const EmailPasswordLogin: React.FC<Props> = ({ showPrompt, fwdUrl }) => {
  const { apiUrl, onRegisterClick } = useConfig();
  const { login } = useSession();
  const { isFetching } = useStatus();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }
  } = useForm<LoginEmailPasswordSchema>({
    mode: "onChange",
    resolver: zodResolver(loginEmailPasswordSchema)
  })

  const onSubmit = useAttempt(async (data: LoginEmailPasswordSchema) => {
    await loginEmailPassword(apiUrl, data.email!, data.password);
    await login(fwdUrl);
  })

  return (
    <>
      {showPrompt && (
        <PromptContainer>
          <>Or with email and password</>
        </PromptContainer>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <Controller
            name="email"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <>
                <Input
                  type="email"
                  ref={ref}
                  placeholder="Email address"
                  invalid={!!errors.email}
                  disabled={isSubmitting || isFetching}
                  {...field}
                />

                {!!errors.email?.message && (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                )}
              </>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <>
                <Input
                  type="password"
                  ref={ref}
                  placeholder="Your password"
                  invalid={!!errors.password}
                  disabled={isSubmitting || isFetching}
                  {...field}
                />

                {!!errors.password?.message && (
                  <FormErrorMessage>{errors.password.message}</FormErrorMessage>
                )}
              </>
            )}
          />

          <LoginButton
            type="submit"
            disabled={!isValid || isSubmitting || isFetching}
          >
            Login
          </LoginButton>

          <Button variant="link" onClick={() => onRegisterClick?.(fwdUrl)}>
            Register
          </Button>
        </Container>
      </form>
    </>
  )
}
