export interface CalendarEvent {
	id: string;
	title: string;
	description?: string;
	start: string | Date;
	end: string | Date;
	allDay?: boolean;
	backgroundColor?: string;
	borderColor?: string;
	done?: boolean;
}
