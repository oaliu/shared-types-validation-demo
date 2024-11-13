import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email"),
  password: z.string().min(1, { message: "Password is required" }),
});

export type TSignInData = z.infer<typeof signInSchema>;
