import { mapEventToTaskPayload } from "@/features/calendar/lib/taskMapper";
import { request } from "../client";
import type { CalendarEvent } from "@/features/calendar/types";

export interface UpdateTaskParams {
    token?: string;
    taskId: string;
    task: CalendarEvent;
}

export async function updateTask({ token, taskId, task }: UpdateTaskParams): Promise<CalendarEvent> {
    return request<CalendarEvent>("PATCH", `/tasks/${taskId}`, {
        token,
        body: mapEventToTaskPayload(task),
    });
}