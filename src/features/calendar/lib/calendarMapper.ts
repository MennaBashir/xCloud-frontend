import type { CalendarEvent } from "../types";

export interface ApiCalendarEvent {
	id: string;
	user_id?: string;
	title: string;
	description?: string | null;
	location?: string | null;
	color?: string | null;
	start_time: string;
	end_time: string;
	google_event_id?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
}

export interface CalendarEventPayload {
	title: string;
	description?: string | null;
	location?: string | null;
	color?: string | null;
	start_time: string;
	end_time: string;
}

const DEFAULT_COLOR = "#3357FF";
const SYNCED_COLOR = "#33A852";

export const mapApiEventToEvent = (event: ApiCalendarEvent): CalendarEvent => {
	const synced = Boolean(event.google_event_id);
	const color = event.color || (synced ? SYNCED_COLOR : DEFAULT_COLOR);
	return {
		id: event.id,
		title: event.title,
		description: event.description ?? undefined,
		start: event.start_time,
		end: event.end_time,
		allDay: false,
		backgroundColor: color,
		borderColor: color,
		googleEventId: event.google_event_id ?? undefined,
		location: event.location ?? undefined,
	};
};

export const mapEventToPayload = (event: Partial<CalendarEvent>): CalendarEventPayload => {
	return {
		title: event.title ?? "",
		description: event.description ?? undefined,
		location: event.location ?? undefined,
		color: event.backgroundColor ?? undefined,
		start_time: new Date(event.start as string | Date).toISOString(),
		end_time: new Date((event.end ?? event.start) as string | Date).toISOString(),
	};
};
