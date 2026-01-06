import type {
	DateSelectArg,
	DatesSetArg,
	EventClickArg,
	EventDropArg,
} from "@fullcalendar/core/index.js";
import type FullCalendar from "@fullcalendar/react";
import { useEffect, useRef, useState } from "react";
import useCalendarEvents from "./useCalendarEvents";
import type { EventResizeDoneArg } from "@fullcalendar/interaction/index.js";
import type { CalendarEvent } from "@/features/Calendar/types";
import { v4 as uuidv4 } from "uuid";

export const useCalendarController = () => {
	// --- STATE ---
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { events, addEvent, updateEvent, deleteEvent, resizeEvent, dropEvent } =
		useCalendarEvents();

	const calendarRef = useRef<FullCalendar | null>(null);

	const [currentView, setCurrentView] = useState("dayGridMonth");

	const [dateTitle, setDateTitle] = useState("");

	const [selectedDateRange, setSelectedDateRange] = useState<{
		start: string | Date;
		end: string | Date;
	} | null>(null);

	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
		null,
	);

	useEffect(() => {
		if (!isModalOpen) {
			setSelectedEvent(null);
			setSelectedDateRange(null);
		}
	}, [isModalOpen]);

	// --- HANDLERS ---
	const handleViewChange = (view: string) => {
		calendarRef.current?.getApi().changeView(view);
		setCurrentView(view);
	};

	const handlePrev = () => calendarRef.current?.getApi().prev();
	const handleNext = () => calendarRef.current?.getApi().next();
	const handleDateTitle = (arg: DatesSetArg) => setDateTitle(arg.view.title);

	const handleEventDrop = (info: EventDropArg) => {
		const { id, endStr, startStr } = info.event;
		dropEvent(id, startStr, endStr || startStr);
	};

	const handleEventResize = (info: EventResizeDoneArg) => {
		const { id, endStr } = info.event;
		resizeEvent(id, endStr);
	};

	const handleDateSelect = (selectInfo: DateSelectArg) => {
		setSelectedDateRange({
			start: selectInfo.startStr,
			end: selectInfo.endStr,
		});
		setIsModalOpen(true);
	};

	const handleEventClick = (clickInfo: EventClickArg) => {
		setSelectedEvent({
			id: clickInfo.event.id,
			title: clickInfo.event.title,
			start: clickInfo.event.startStr,
			end: clickInfo.event.endStr || clickInfo.event.startStr,
			description: clickInfo.event.extendedProps.description,
			done: clickInfo.event.extendedProps.done,
			allDay: clickInfo.event.allDay,
			backgroundColor: clickInfo.event.backgroundColor,
			borderColor: clickInfo.event.borderColor,
		});
		setIsModalOpen(true);
	};

	const handleEventSubmit = (eventData: CalendarEvent) => {
		if (selectedEvent) {
			updateEvent(selectedEvent.id, eventData);
		} else {
			const newEvent = {
				...eventData,
				id: uuidv4(),
			};
			addEvent(newEvent);
		}
		setIsModalOpen(false);
	};

	const handleEventDelete = () => {
		deleteEvent(selectedEvent?.id || "");
		setIsModalOpen(false);
	};
	return {
		handleViewChange,
		handleDateSelect,
		handleEventClick,
		handleEventSubmit,
		handleEventDelete,
		handleEventDrop,
		handleEventResize,
		handlePrev,
		handleNext,
		handleDateTitle,
		setIsModalOpen,
		setSelectedDateRange,
		setSelectedEvent,
		selectedEvent,
		calendarRef,
		currentView,
		dateTitle,
		selectedDateRange,
		isModalOpen,
		events,
	};
};
