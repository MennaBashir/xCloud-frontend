import { request } from "../client";

export type DeleteCalendarEventParams = {
	token?: string;
	eventId: string;
};

export async function deleteCalendarEvent({
	token,
	eventId,
}: DeleteCalendarEventParams) {
	await request("DELETE", `/calendar/${eventId}`, { token });
}
