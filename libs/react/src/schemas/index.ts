import { z } from "zod";

export const registerEmailPasswordSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(1).optional(),
  password: z.string().min(8),
  repeatPassword: z.string().min(8),
}).refine(({ password, repeatPassword }) => password === repeatPassword, {
  path: ['repeatPassword'],
  message: "Passwords must match"
});

export type RegisterEmailPasswordSchema = z.infer<typeof registerEmailPasswordSchema>;

export const loginEmailPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginEmailPasswordSchema = z.infer<typeof loginEmailPasswordSchema>;
