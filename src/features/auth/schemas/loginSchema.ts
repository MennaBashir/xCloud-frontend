import { z } from "zod";

export const loginSchema = z.object({
	username: z
		.string()
		.min(1, "auth:errors.required")
		.min(3, "auth:errors.usernameTooShort"),
	password: z
		.string()
		.min(4, "auth:errors.passwordTooShort"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
