import { request } from "../client";
import type { CalendarEvent } from "@/features/calendar/types";
import {
	mapApiEventToEvent,
	type ApiCalendarEvent,
} from "@/features/calendar/lib/calendarMapper";

export type GetCalendarEventsParams = {
	token?: string;
	daysAhead?: number;
	daysBehind?: number;
};

export async function getCalendarEvents({
	token,
	daysAhead,
	daysBehind,
}: GetCalendarEventsParams = {}): Promise<CalendarEvent[]> {
	const response = await request<ApiCalendarEvent[]>("GET", "/calendar/", {
		token,
		query: { days_ahead: daysAhead, days_behind: daysBehind },
	});
	return response.map(mapApiEventToEvent);
}

export type GetCalendarEventParams = {
	token?: string;
	eventId: string;
};

export async function getCalendarEvent({
	token,
	eventId,
}: GetCalendarEventParams): Promise<CalendarEvent> {
	const response = await request<ApiCalendarEvent>(
		"GET",
		`/calendar/${eventId}`,
		{ token },
	);
	return mapApiEventToEvent(response);
}
