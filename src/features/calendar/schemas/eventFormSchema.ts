import { z } from "zod";
import type { TFunction } from "i18next";

export const getFormSchema = (t: TFunction) => z
    .object({
        id: z.string().optional(),
        title: z
            .string()
            .min(2, t("validation.titleMin"))
            .max(100, t("validation.titleMax")),
        description: z
            .string()
            .max(500, t("validation.descMax"))
            .optional(),
        start: z.string().nonempty(t("validation.startRequired")),
        end: z.string().nonempty(t("validation.endRequired")),
        allDay: z.boolean().optional(),
        backgroundColor: z.string().optional(),
        borderColor: z.string().optional(),
        done: z.boolean().optional(),
        reminders: z.array(z.any()).optional(),
    })
    .refine(
        (data) => {
            if (!data.start || !data.end) return true;
            const startDate = new Date(data.start);
            const endDate = new Date(data.end);
            return startDate <= endDate;
        },
        {
            message: t("validation.endAfterStart"),
            path: ["end"],
        },
    );

export type EventFormValues = z.infer<ReturnType<typeof getFormSchema>>;