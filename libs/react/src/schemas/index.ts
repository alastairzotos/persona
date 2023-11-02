import { z } from "zod";

export const userDetailSchema = z.enum(["first_name", "last_name", "display_name"])

export const registerEmailPasswordSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8),
  repeatPassword: z.string().min(8),
  details: z.record(userDetailSchema, z.string()).optional(),
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
