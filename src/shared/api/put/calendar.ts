import { request } from "../client";
import type { CalendarEvent } from "@/features/calendar/types";
import {
	mapApiEventToEvent,
	type ApiCalendarEvent,
} from "@/features/calendar/lib/calendarMapper";

export interface UpdateCalendarEventParams {
	token?: string;
	eventId: string;
	event: Partial<CalendarEvent>;
}

export async function updateCalendarEvent({
	token,
	eventId,
	event,
}: UpdateCalendarEventParams): Promise<CalendarEvent> {
	const body: Record<string, unknown> = {};
	if (event.title !== undefined) body.title = event.title;
	if (event.description !== undefined) body.description = event.description;
	if (event.location !== undefined) body.location = event.location;
	if (event.backgroundColor !== undefined) body.color = event.backgroundColor;
	if (event.start !== undefined)
		body.start_time = new Date(event.start as string | Date).toISOString();
	if (event.end !== undefined)
		body.end_time = new Date(event.end as string | Date).toISOString();

	const response = await request<ApiCalendarEvent>(
		"PATCH",
		`/calendar/${eventId}`,
		{ token, body },
	);
	return mapApiEventToEvent(response);
}
