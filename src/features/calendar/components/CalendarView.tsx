import { useTranslation } from "react-i18next";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { ChevronLeft, ChevronRight, Loader2, Plus, Bell, RefreshCw } from "lucide-react";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/shared/i18n/LanguageProvider";

import { EventForm } from "@/features/calendar/components";
import { useCalendarController } from "../hooks/useCalendarController";
import "../styles/fullcalendar.css";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const VIEW_TYPES: Array<{ labelKey: string; value: string }> = [
	{ labelKey: "views.month", value: "dayGridMonth" },
	{ labelKey: "views.week", value: "timeGridWeek" },
	{ labelKey: "views.day", value: "timeGridDay" },
];

const CalendarView = () => {
	const { t } = useTranslation("calendar");
	const { isRtl } = useLanguage();
	const {
		calendarRef,
		currentView,
		dateTitle,
		isModalOpen,
		selectedEvent,
		selectedDateRange,
		isLoading,
		events,
		error,
		setIsModalOpen,
		handleViewChange,
		handlePrev,
		handleNext,
		handleToday,
		handleDateTitle,
		handleEventDrop,
		handleEventResize,
		handleDateSelect,
		handleEventClick,
		handleEventSubmit,
		handleEventDelete,
		syncWithGoogle,
		isSyncing,
	} = useCalendarController();


	const [hasLadedOnce, setHasLadedOnce] = useState(false);
	useEffect(()=>{
		if (!isLoading) setHasLadedOnce(true);
	},[isLoading])

	useEffect(() => {
        if (!hasLadedOnce && error) {
            toast.error(t("events.loadingError"));
        }
    }, [error]);

	if (isLoading && !hasLadedOnce) {
        return (
            <div className="flex h-[670px] w-full items-center justify-center rounded-xl bg-gray-900/50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
					<p className="text-gray-400">{t("events.loading")}</p>
                </div>
            </div>
        );
    }

	else {	
		return (
		<div className="flex-1 min-w-0 flex flex-col gap-5">
			{/* Toolbar */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<h2 className="text-foreground font-semibold tracking-tight text-[1.125rem] sm:text-[1.25rem]">
						{dateTitle}
					</h2>
					<div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-surface-muted p-0.5">
						<button
							type="button"
							onClick={handlePrev}
							aria-label={t("actions.previous")}
							className={cn(
								"grid size-7 place-items-center rounded-full",
								"text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
								"active:scale-[0.96]",
							)}
						>
							{isRtl ? (
								<ChevronRight className="size-3.5" strokeWidth={1.6} />
							) : (
								<ChevronLeft className="size-3.5" strokeWidth={1.6} />
							)}
						</button>
						<button
							type="button"
							onClick={handleToday}
							className={cn(
								"h-7 px-3 rounded-full text-[0.75rem] font-medium",
								"text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
								"active:scale-[0.96]",
							)}
						>
							{t("views.today")}
						</button>
						<button
							type="button"
							onClick={handleNext}
							aria-label={t("actions.next")}
							className={cn(
								"grid size-7 place-items-center rounded-full",
								"text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
								"active:scale-[0.96]",
							)}
						>
							{isRtl ? (
								<ChevronLeft className="size-3.5" strokeWidth={1.6} />
							) : (
								<ChevronRight className="size-3.5" strokeWidth={1.6} />
							)}
						</button>
					</div>
				</div>

				<div className="flex items-center gap-2 ms-auto flex-wrap">
					{/* View switcher */}
					<div
						role="radiogroup"
						aria-label="View"
						className="inline-flex items-center gap-0.5 rounded-full border border-border bg-surface-muted p-0.5"
					>
						{VIEW_TYPES.map((view) => {
							const active = currentView === view.value;
							return (
								<button
									key={view.value}
									type="button"
									role="radio"
									aria-checked={active}
									onClick={() => handleViewChange(view.value)}
									className={cn(
										"h-7 px-3 rounded-full text-[0.75rem] font-medium",
										"transition-[background-color,color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
										"active:scale-[0.96]",
										active
											? "bg-card text-foreground shadow-[0_1px_2px_oklch(0_0_0/0.06),inset_0_1px_0_oklch(1_0_0/0.1)] ring-1 ring-border-strong"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									{t(view.labelKey)}
								</button>
							);
						})}
					</div>

					<Button
						onClick={() => syncWithGoogle(false)}
						disabled={isSyncing}
						size="sm"
						variant="outline"
						className="gap-2"
					>
						<RefreshCw
							className={cn("size-3.5", isSyncing && "animate-spin")}
							strokeWidth={1.8}
						/>
						<span>{t("actions.syncGoogle")}</span>
					</Button>

					<Button
						onClick={() => setIsModalOpen(true)}
						size="sm"
						className="gap-2"
					>
						<Plus className="size-3.5" strokeWidth={1.8} />
						<span>{t("actions.addEvent")}</span>
					</Button>
				</div>
			</div>

			{/* Calendar card */}
			<div className="flex-1 rounded-[var(--radius-2xl)] bg-card border border-border overflow-hidden shadow-[0_1px_2px_oklch(0_0_0/0.04),inset_0_1px_0_oklch(1_0_0/0.05)]">
				<div className="w-full overflow-x-auto overflow-y-auto">
					<div className="min-w-[400px]">
						<FullCalendar
							ref={calendarRef}
							plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
							headerToolbar={false}
							initialView="dayGridMonth"
							datesSet={handleDateTitle}
							direction={isRtl ? "rtl" : "ltr"}
							events={events}
							editable={true}
							selectable={true}
							selectMirror={true}
							dayMaxEvents={2}
							eventDrop={handleEventDrop}
							eventResize={handleEventResize}
							select={handleDateSelect}
							eventClick={handleEventClick}
							aspectRatio={1.6}
							eventDisplay="block"
							height="auto"
							eventClassNames={(arg) => {
								const isDone = arg.event.extendedProps.done;		
								return cn(
									"border-none text-primary-foreground cursor-pointer",
									isDone && "opacity-50 line-through grayscale",
								);
							}}
							eventContent={(arg)=> {
								const hasReminders = arg.event.extendedProps.hasReminders;
								const title = arg.event.title;
								return (
                                    <div className="flex items-center gap-1.5 w-full truncate overflow-hidden">
                                        {hasReminders && (
                                            <Bell className="size-3 shrink-0" strokeWidth={2.5} />
                                        )}
                                        <span className="truncate text-xs font-medium">
                                            {title}
                                        </span>
                                    </div>
                                );
							}}
						/>
					</div>
				</div>
			</div>

			{/* Event editor — Sheet drawer (right side, auto-flips for RTL) */}
			<Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
				<SheetContent
					side={isRtl ? "left" : "right"}
					className="w-[28rem] sm:w-[32rem] max-w-[100vw] p-0 flex flex-col"
				>
					<SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
						<SheetTitle className="text-foreground font-semibold tracking-tight text-[1.125rem]">
							{selectedEvent
								? t("actions.editEvent")
								: t("actions.newEvent")}
						</SheetTitle>
						<SheetDescription className="text-[0.8125rem] text-muted-foreground">
							{selectedEvent
								? t("form.descriptionPlaceholder")
								: t("form.descriptionPlaceholder")}
						</SheetDescription>
					</SheetHeader>

					<div className="flex-1 overflow-y-auto px-6 py-5">
						<EventForm
							selectedEvent={selectedEvent}
							selectedDateRange={selectedDateRange}
							isModalOpen={isModalOpen}
							onSubmitEvent={handleEventSubmit}
							onDeleteEvent={handleEventDelete}
						/>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
    }
};

export default CalendarView;
