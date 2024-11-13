import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email"),
});

export type TForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
