import {request} from "../client";
import type { CalendarReminder } from "@/features/calendar/types";

export interface GetRemindersParams {
    token?: string;
    task_id?: string;
}

export async function getReminders({ token, task_id }: GetRemindersParams): Promise<CalendarReminder[]> {
    const endpoint = task_id ? `/reminders/${task_id}` : "/reminders";
    return request<CalendarReminder[]>("GET", endpoint, {
        token,
    });
}