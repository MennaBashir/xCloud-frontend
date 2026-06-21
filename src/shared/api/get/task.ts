import { request } from "../client";
import type { CalendarEvent } from "@/features/calendar/types";
import { mapTaskToEvent, type ApiTask } from "@/features/calendar/lib/taskMapper";

export type GetTasksParams = {
    token?: string;
    status?: string;
    priority?: string;
};

export async function getTasks({
    token,
    status,
    priority,
}: GetTasksParams = {}): Promise<CalendarEvent[]> {
    const response = await request<ApiTask[]>("GET", "/tasks", {
        token,
        query: { status, priority },
    });
    return response.map(mapTaskToEvent);
}

export type GetTaskParams = {
    token?: string;
    taskId: string;
};

export async function getTask({
    token,
    taskId,
}: GetTaskParams): Promise<CalendarEvent> {
    const response = await request<ApiTask>("GET", `/tasks/${taskId}`, {
        token,
    });
    return mapTaskToEvent(response);
}