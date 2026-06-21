import { mapEventToTaskPayload } from "@/features/calendar/lib/taskMapper";
import { request } from "../client";
import type { CalendarEvent } from "@/features/calendar/types";

export interface PostTaskParams {
    token?: string;
    task: CalendarEvent;
}

export async function postTask({ token, task }: PostTaskParams): Promise<CalendarEvent> {
    return request<CalendarEvent>("POST", "/tasks", {
        token,
        body: mapEventToTaskPayload(task),
    });
}