import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "auth:errors.required")
		.email("auth:errors.invalidEmail"),
	password: z
		.string()
		.min(8, "auth:errors.passwordTooShort"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
