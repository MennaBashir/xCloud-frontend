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
	hasReminders?: boolean;
	reminders?: CalendarReminder[];
	googleEventId?: string;
	location?: string;
}

export interface CalendarReminder {
    id?: string; 
    task_id: string;
	remind_at: string;
}