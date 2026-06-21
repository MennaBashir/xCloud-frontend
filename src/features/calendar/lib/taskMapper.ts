import type { CalendarEvent } from "../types";

export interface ApiTask {
	id: string,
    title: string,
    description: string,
    status: string,
    priority: string,
    due_date: string,
    // user_id: string,
    // created_at: string,
    // updated_at: string
}

export const mapTaskToEvent = (task: ApiTask): CalendarEvent => {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        start: task.due_date,
        end: task.due_date,
        allDay: true,
        backgroundColor: task.priority === "high" ? "#FF5733" : task.status === "done" ? "#33FF57" : "#3357FF",
        borderColor: task.priority === "high" ? "#FF5733" : task.status === "done" ? "#33FF57" : "#3357FF",
        done: task.status === "done",
    }
};

export const mapEventToTaskPayload = (event: CalendarEvent): ApiTask => {
    return {
        id: event.id,
        title: event.title,
        description: event.description || "",
        status: event.done ? "done" : "pending",
        priority: "high",
        due_date: new Date(event.start).toISOString(),
    }
}