import {request} from "../client";

export interface DeleteReminderParams {
    token?: string;
    task_id: string;
}

export async function deleteReminder({
    token,
    task_id,
}: DeleteReminderParams): Promise<void> {
    return request<void>("DELETE", `/reminders/${task_id}`, { token });
}