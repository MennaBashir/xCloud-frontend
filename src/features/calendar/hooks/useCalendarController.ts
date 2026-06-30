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
import type { CalendarEvent, CalendarReminder } from "@/features/calendar/types";
import { useReminder } from "./useReminder";
import { useLocalReminders } from "./useLocalReminders";


export const useCalendarController = () => {
	// --- STATE ---
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { events ,error ,isLoading ,isFetching, addEvent, updateEvent, deleteEvent, resizeEvent, dropEvent, syncWithGoogle, isSyncing } =
		useCalendarEvents();

	const {addReminder, removeReminder, isAddingReminder ,reminderError, isRemovingReminder} = useReminder();

	const { reminders: localReminders, deletedIds, clearLocalReminders } = useLocalReminders();

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
			clearLocalReminders();
		}
	}, [isModalOpen]);

	// Auto-sync with Google Calendar once when the calendar mounts so that
	// events added/deleted directly in Google show up on the site.
	// Guarded so StrictMode's double-mount can't fire it twice.
	const syncRef = useRef(syncWithGoogle);
	syncRef.current = syncWithGoogle;
	const hasAutoSynced = useRef(false);
	useEffect(() => {
		if (hasAutoSynced.current) return;
		hasAutoSynced.current = true;
		syncRef.current(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// --- HANDLERS ---
	const handleViewChange = (view: string) => {
		calendarRef.current?.getApi().changeView(view);
		setCurrentView(view);
	};

	const handlePrev = () => calendarRef.current?.getApi().prev();
	const handleNext = () => calendarRef.current?.getApi().next();
	const handleToday = () => calendarRef.current?.getApi().today();
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
			hasReminders: clickInfo.event.extendedProps.hasReminders,
			reminders: clickInfo.event.extendedProps.reminders,
		});
		setIsModalOpen(true);
	};

	const handleEventSubmit = async (eventData: CalendarEvent) => {
        const { reminders, hasReminders, id, ...taskData } = eventData as any;
        
        try {
            let currentEventId = selectedEvent?.id;

            if (selectedEvent) {
                updateEvent(selectedEvent.id, taskData);
            } else {
                const newEvent = await addEvent(taskData);
                if (newEvent && newEvent.id) {
                    currentEventId = newEvent.id;
                }
            }

            if (currentEventId) {
                deletedIds.forEach((deletedId) => {
                    removeReminder(deletedId);
                });

                const newReminders = localReminders.filter((r) => String(r.id).startsWith("temp-"));
                newReminders.forEach((reminder) => {
                    addReminder({
                        task_id: currentEventId,
                        remind_at: reminder.remind_at || (reminder as any).remindAt,
                    });
                });
            }

            clearLocalReminders();
            setIsModalOpen(false);
            
        } catch (error) {
            console.error("Error submitting event and reminders:", error);
        }
    };

	const handleEventDelete = () => {
		if(!selectedEvent) return;
		deleteEvent(selectedEvent.id);
		
		selectedEvent.reminders?.forEach((reminder: CalendarReminder) => removeReminder(reminder.id!));
		clearLocalReminders();
		
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
		handleToday,
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
		isFetching,
		isLoading,
		events,
		error,

		syncWithGoogle,
		isSyncing,

		isAddingReminder,
		isRemovingReminder,
		reminderError
	};
};
