import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import styled from 'styled-components'
import { userDetailLabel } from "@bitmetro/persona-types";

import { StatusProvider, useStatus } from "../../../contexts/status.context";
import { useConfig } from "../../../contexts/config.context";
import { registerEmailPassword } from "../../../requests/auth";
import { RegisterEmailPasswordSchema, registerEmailPasswordSchema } from "../../../schemas";
import { Button, Container } from "../../primitives";
import { useSession } from "../../../contexts/session.context";
import { Wrapper } from "../../wrapper";
import { useAttempt, useFetchConfig } from "../../../hooks";
import { FormErrorMessage, Input } from "../../primitives/forms";

const RegisterButton = styled(Button)({
  marginTop: 12,
})

const RegisterFormInner: React.FC = () => {
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

    await login(accessToken);
  })

  if (!config || isFetchingConfig) {
    return <p>Loading...</p>;
  }

  if (status === "success") {
    return; // If using verification, show "check your emails" prompt here
  }

  const userDetails = config.emailPasswordConfig?.userDetails;

  return (
    <Wrapper>
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
                  placeholder="Your email"
                  invalid={!!errors.email}
                  disabled={isSubmitting}
                  {...field}
                />

                {!!errors.email?.message && (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                )}
              </>
            )}
          />

          {userDetails && (
            userDetails.map(detail => (
              <Controller
                key={detail}
                name={`details.${detail}`}
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <>
                    <Input
                      ref={ref}
                      placeholder={userDetailLabel[detail]}
                      invalid={!!errors.details?.[detail]}
                      disabled={isSubmitting}
                      {...field}
                    />

                    {!!errors.details?.[detail]?.message && (
                      <FormErrorMessage>{errors.details?.[detail]?.message}</FormErrorMessage>
                    )}
                  </>
                )}
              />
            ))
          )}

          <Controller
            name="password"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <>
                <Input
                  type="password"
                  ref={ref}
                  placeholder="Your password"
                  disabled={isSubmitting}
                  {...field}
                />

                {!!errors.password?.message && (
                  <FormErrorMessage>{errors.password.message}</FormErrorMessage>
                )}
              </>
            )}
          />

          <Controller
            name="repeatPassword"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <>
                <Input
                  type="password"
                  ref={ref}
                  placeholder="Repeat password"
                  invalid={!!errors.repeatPassword}
                  disabled={isSubmitting}
                  {...field}
                />

                {!!errors.repeatPassword?.message && (
                  <FormErrorMessage>{errors.repeatPassword.message}</FormErrorMessage>
                )}
              </>
            )}
          />

          <RegisterButton
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            Register
          </RegisterButton>
        </Container>
      </form>
    </Wrapper>
  )
}

export const RegisterForm: React.FC = () => {
  return (
    <StatusProvider>
      <RegisterFormInner />
    </StatusProvider>
  )
}
