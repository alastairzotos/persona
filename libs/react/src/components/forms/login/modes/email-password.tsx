import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import styled from '@emotion/styled'
import { LoginEmailPasswordSchema, loginEmailPasswordSchema } from "../../../../schemas";
import { AbsoluteCenter, Box, Button, Divider, FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { useStatus } from "../../../../contexts/status.context";
import { loginEmailPassword } from "../../../../requests/auth";
import { useConfig } from "../../../../contexts/config.context";
import { Container } from "../../../primitives";
import { useSession } from "../../../../contexts/session.context";
import { useAttempt } from "../../../../hooks";

const PromptContainer = styled('div')({
  textAlign: 'center'
})

const LoginButton = styled(Button)({
  marginTop: 12,
})

interface Props {
  showPrompt: boolean;
}

export const EmailPasswordLogin: React.FC<Props> = ({ showPrompt }) => {
  const { apiUrl, gotoRegisterUrl } = useConfig();
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
    const { accessToken } = await loginEmailPassword(apiUrl, data.email!, data.password);

    login(accessToken);
  })

  return (
    <>
      {showPrompt && (
        <Box position='relative' padding='10'>
          <Divider />
          <AbsoluteCenter bg='white' px='4'>
            <PromptContainer>
              Or with email and password
            </PromptContainer>
          </AbsoluteCenter>
        </Box>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <Controller
            name="email"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <FormControl isInvalid={!!errors.email}>
                <Input
                  type="email"
                  ref={ref}
                  placeholder="Email address"
                  isDisabled={isSubmitting || isFetching}
                  {...field}
                />

                {!!errors.email?.message && (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <FormControl isInvalid={!!errors.password}>
                <Input
                  type="password"
                  ref={ref}
                  placeholder="Your password"
                  isDisabled={isSubmitting || isFetching}
                  {...field}
                />

                {!!errors.password?.message && (
                  <FormErrorMessage>{errors.password.message}</FormErrorMessage>
                )}
              </FormControl>
            )}
          />

          <LoginButton
            type="submit"
            isDisabled={!isValid || isSubmitting || isFetching}
          >
            Login
          </LoginButton>

          <Button variant="link" onClick={gotoRegisterUrl}>
            Register
          </Button>
        </Container>
      </form>
    </>
  )
}
