import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import styled from '@emotion/styled'

import { useStatus } from "../../../contexts/status.context";
import { useConfig } from "../../../contexts/config.context";
import { registerEmailPassword } from "../../../requests/auth";
import { RegisterEmailPasswordSchema, registerEmailPasswordSchema } from "../../../schemas";
import { Container } from "../../primitives";
import { Button, FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { useSession } from "../../../contexts/session.context";
import { userDetailLabel } from "@bitmetro/persona-types";
import { Wrapper } from "../../wrapper";
import { useAttempt, useFetchConfig } from "../../../hooks";

const Title = styled('h2')({
  textAlign: 'center',
  marginTop: 12,
  marginBottom: 12,
})

const RegisterButton = styled(Button)({
  marginTop: 12,
})

export const RegisterForm: React.FC = () => {
  const { apiUrl } = useConfig();
  const { login } = useSession();
  const { status } = useStatus();
  const { config, isFetchingConfig } = useFetchConfig();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }
  } = useForm<RegisterEmailPasswordSchema>({
    mode: "onChange",
    resolver: zodResolver(registerEmailPasswordSchema)
  })

  const onSubmit = useAttempt(async (data: RegisterEmailPasswordSchema) => {
    const { accessToken } = await registerEmailPassword(apiUrl, data.email!, data.password!, data.details!);

    login(accessToken);
  })

  if (!config || isFetchingConfig) {
    return <p>Loading...</p>;
  }

  if (status === "success") {
    return (
      <p>check yer emails</p>
    );
  }

  const userDetails = config.emailPasswordConfig?.userDetails;

  return (
    <Wrapper>
      <Title>Register</Title>

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
                  placeholder="Your email"
                  isDisabled={isSubmitting}
                  {...field}
                />

                {!!errors.email?.message && (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                )}
              </FormControl>
            )}
          />

          {userDetails && (
            userDetails.map(detail => (
              <Controller
                key={detail}
                name={`details.${detail}`}
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <FormControl isInvalid={!!errors.details?.[detail]}>
                    <Input
                      ref={ref}
                      placeholder={userDetailLabel[detail]}
                      isDisabled={isSubmitting}
                      {...field}
                    />

                    {!!errors.details?.[detail]?.message && (
                      <FormErrorMessage>{errors.details?.[detail]?.message}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              />
            ))
          )}

          <Controller
            name="password"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <FormControl>
                <Input
                  type="password"
                  ref={ref}
                  placeholder="Your password"
                  isDisabled={isSubmitting}
                  {...field}
                />

                {!!errors.password?.message && (
                  <FormErrorMessage>{errors.password.message}</FormErrorMessage>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="repeatPassword"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <FormControl>
                <Input
                  type="password"
                  ref={ref}
                  placeholder="Repeat password"
                  isDisabled={isSubmitting}
                  {...field}
                />

                {!!errors.repeatPassword?.message && (
                  <FormErrorMessage>{errors.repeatPassword.message}</FormErrorMessage>
                )}
              </FormControl>
            )}
          />

          <RegisterButton
            type="submit"
            isDisabled={!isValid || isSubmitting}
          >
            Register
          </RegisterButton>
        </Container>
      </form>
    </Wrapper>
  )
}
