import { z } from "zod";

export const formSchema = z
	.object({
		id: z.string().optional(),
		title: z
			.string()
			.min(2, "Title must be at least 2 characters.")
			.max(100, "Title must be at most 100 characters."),
		description: z
			.string()
			.max(500, "Description must be at most 500 characters.")
			.optional(),
		start: z.string().nonempty("Start date is required."),
		end: z.string().nonempty("End date is required."),
		allDay: z.boolean().optional(),
		backgroundColor: z.string().optional(),
		borderColor: z.string().optional(),
		done: z.boolean().optional(),
	})
	.refine(
		(data) => {
			if (!data.start || !data.end) return true;
			const startDate = new Date(data.start);
			const endDate = new Date(data.end);
			return startDate <= endDate;
		},
		{
			message: "End date must be after start date.",
			path: ["end"],
		},
	);

export type EventFormValues = z.infer<typeof formSchema>;
