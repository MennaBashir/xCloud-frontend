import { z } from "zod";

export const signupSchema = z.object({
	name: z
		.string()
		.min(2, "auth:errors.required")
		.max(80),
	workspaceName: z
		.string()
		.min(2, "auth:errors.required")
		.max(80),
	email: z
		.string()
		.min(1, "auth:errors.required")
		.email("auth:errors.invalidEmail"),
	password: z
		.string()
		.min(8, "auth:errors.passwordTooShort"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
