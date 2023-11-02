import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import styled from '@emotion/styled'
import { LoginEmailPasswordSchema, loginEmailPasswordSchema } from "../../schemas";
import { AbsoluteCenter, Box, Button, Divider, FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { useStatus } from "../../contexts/status.context";

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
})

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
  const { isFetching, setStatus } = useStatus();
  // const returnWithAccessToken = useReturnWithAccessToken();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }
  } = useForm<LoginEmailPasswordSchema>({
    mode: "onChange",
    resolver: zodResolver(loginEmailPasswordSchema)
  })

  // const {
  //   status: loginStatus,
  //   request: login,
  //   value: loginResult,
  //   error: loginError
  // } = useLoginWithEmailAndPassword();

  // useEffect(() => {
  //   if (loginStatus === "success") {
  //     returnWithAccessToken(loginResult?.accessToken || "");
  //   }
  // }, [loginStatus]);

  const onSubmit = async (data: LoginEmailPasswordSchema) => {
    console.log(data);
    setStatus("fetching");

    try {
      // await login({
      //   propertyId: property._id,
      //   email: data.email!,
      //   password: data.password,
      // });

      setStatus("success");
    } catch (e) {
      setStatus("error", (e as any).message || JSON.stringify(e));
    }
  }

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
          {/* {loginStatus === "error" && (
            <Alert severity="warning">{loginError.response?.data?.message || "There was an unexpected error"}</Alert>
          )} */}

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

          <a
            // LinkComponent={Link}
            // href={`/register?propertyId=${property.uniqueId}&fwd=${encodeURIComponent(getForwardUrl())}`}
            target="_blank"
            href="#"
          >
            Register
          </a>
        </Container>
      </form>
    </>
  )
}
