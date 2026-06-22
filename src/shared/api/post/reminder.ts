import type { CalendarReminder } from "@/features/calendar/types";
import {request} from "../client";

export interface PostReminderParams {
    token?: string;
    reminder: CreateReminderPayload
}

export interface CreateReminderPayload {
    task_id: string;
    remind_at: string;
}

export async function postReminder({ token, reminder }: PostReminderParams): Promise<CalendarReminder> {
    return request<CalendarReminder>("POST", "/reminders/", {
        token,
        body: reminder,
    });
}