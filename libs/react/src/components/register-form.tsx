import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import styled from '@emotion/styled'
import { useStatus } from "../contexts/status.context";
import { useConfig } from "../contexts/config.context";
import { errorString } from "../utils";
import { registerEmailPassword } from "../requests/auth";
import { useQuery } from "@tanstack/react-query";
import { fetchConfig } from "../requests/config";
import { RegisterEmailPasswordSchema, registerEmailPasswordSchema } from "../schemas";
import { Container, FormBox } from "./primitives";
import { Button, FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { useSession } from "../contexts/session.context";
import { userDetailLabel } from "@bitmetro/persona-types";

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
  const { setStatus, status } = useStatus();

  const { data: config, isFetching } = useQuery({
    queryKey: ['config'],
    queryFn: () => fetchConfig(apiUrl),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }
  } = useForm<RegisterEmailPasswordSchema>({
    mode: "onChange",
    resolver: zodResolver(registerEmailPasswordSchema)
  })

  const onSubmit = async (data: RegisterEmailPasswordSchema) => {
    try {
      setStatus('fetching');

      const { accessToken } = await registerEmailPassword(apiUrl, data.email!, data.password!, data.details!);

      login(accessToken);

      setStatus('success');
    } catch (e) {
      setStatus('error', errorString(e));
    }
  }

  if (!config || isFetching) {
    return <p>Loading...</p>;
  }

  if (status === "success") {
    return (
      <p>check yer emails</p>
    );
  }

  const userDetails = config.emailPasswordConfig?.userDetails;

  return (
    <FormBox>
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
    </FormBox>
  )
}
