import { z } from "zod";

export const forgotSchema = z.object({
	email: z
		.string()
		.min(1, "auth:errors.required")
		.email("auth:errors.invalidEmail"),
});

export type ForgotFormValues = z.infer<typeof forgotSchema>;
