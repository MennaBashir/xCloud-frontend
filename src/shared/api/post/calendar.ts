import { request } from "../client";
import type { CalendarEvent } from "@/features/calendar/types";
import {
	mapApiEventToEvent,
	mapEventToPayload,
	type ApiCalendarEvent,
} from "@/features/calendar/lib/calendarMapper";

export interface PostCalendarEventParams {
	token?: string;
	event: CalendarEvent;
}

export async function postCalendarEvent({
	token,
	event,
}: PostCalendarEventParams): Promise<CalendarEvent> {
	const response = await request<ApiCalendarEvent>("POST", "/calendar/", {
		token,
		body: mapEventToPayload(event),
	});
	return mapApiEventToEvent(response);
}

export interface SyncCalendarParams {
	token?: string;
}

export interface SyncCalendarResult {
	pushed: number;
	pulled: number;
	updated: number;
	deleted: number;
}

const SYNC_TIMEOUT_MS = 60_000;

export async function syncCalendar({
	token,
}: SyncCalendarParams = {}): Promise<SyncCalendarResult> {
	// Guard against a slow/hung sync keeping the UI in a pending state forever.
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), SYNC_TIMEOUT_MS);
	try {
		return await request<SyncCalendarResult>("POST", "/calendar/sync", {
			token,
			signal: controller.signal,
		});
	} finally {
		clearTimeout(timer);
	}
}
