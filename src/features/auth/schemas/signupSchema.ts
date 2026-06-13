import { z } from "zod";

export const signupSchema = z.object({
	username: z
		.string()
		.min(1, "auth:errors.required")
		.min(3, "auth:errors.usernameTooShort")
		.max(80),
	password: z
		.string()
		.min(4, "auth:errors.passwordTooShort"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
