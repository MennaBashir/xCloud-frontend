import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { CalendarEvent } from "@/features/Calendar/types";

export interface EventsState {
	events: CalendarEvent[];
	resizeEvent: (id: string, newEnd: string | Date) => void;
	dropEvent: (
		id: string,
		newStart: string | Date,
		newEnd: string | Date,
	) => void;
	addEvent: (event: CalendarEvent) => void;
	updateEvent: (id: string, event: CalendarEvent) => void;
	deleteEvent: (id: string) => void;
	toggleDone: (id: string) => void;
}

const useCalendarEvents = create<EventsState>((set) => ({
	events: [
		{
			id: uuidv4(),
			title: "Design Review",
			description: "Review the new app design mockups.",
			start: new Date().toISOString().split("T")[0],
			end: new Date().toISOString().split("T")[0],
			allDay: true,
			backgroundColor: "#3B82F6",
			borderColor: "#fff",
		},
		{
			id: uuidv4(),
			title: "Meeting with Team",
			start: new Date(
				new Date().setDate(new Date().getDate() + 2),
			).toISOString(),
			end: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
			allDay: true,
			backgroundColor: "#10B981",
			borderColor: "#fff",
		},
	],
	resizeEvent: (id, newEnd) =>
		set((state) => ({
			events: state.events.map((event) =>
				event.id === id ? { ...event, end: newEnd } : event,
			),
		})),
	dropEvent: (id, newStart, newEnd) =>
		set((state) => ({
			events: state.events.map((event) =>
				event.id === id ? { ...event, start: newStart, end: newEnd } : event,
			),
		})),
	addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
	updateEvent: (id, event) =>
		set((state) => ({
			events: state.events.map((e) => (e.id === id ? { ...e, ...event } : e)),
		})),
	deleteEvent: (id) =>
		set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
	toggleDone: (id) =>
		set((state) => ({
			events: state.events.map((event) =>
				event.id === id ? { ...event, done: !event.done } : event,
			),
		})),
}));

export default useCalendarEvents;
