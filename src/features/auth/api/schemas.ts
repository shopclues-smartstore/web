import { z } from "zod";

/**
 * Signup form schema. Aligned with backend: email required, password min 8 max 128, name optional max 255.
 */
export const signupFormSchema = z.object({
  name: z.string().max(255).optional().or(z.literal("")),
  email: z.string().min(1, "Email is required").email("Invalid email").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});

export type SignupFormValues = z.infer<typeof signupFormSchema>;
