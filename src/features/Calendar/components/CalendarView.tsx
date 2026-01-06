import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from "@/features/Calendar/components";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import "../Styles/fullcalendar.css";
import { images } from "../assets";
import { useCalendarController } from "../hooks/useCalendarController";

const VIEW_TYPES = [
	{ label: "Month", value: "dayGridMonth" },
	{ label: "Week", value: "timeGridWeek" },
	{ label: "Day", value: "timeGridDay" },
];

const CalendarView = () => {
	const {
		calendarRef,
		currentView,
		dateTitle,
		isModalOpen,
		selectedEvent,
		selectedDateRange,
		events,
		setIsModalOpen,
		handleViewChange,
		handlePrev,
		handleNext,
		handleDateTitle,
		handleEventDrop,
		handleEventResize,
		handleDateSelect,
		handleEventClick,
		handleEventSubmit,
		handleEventDelete,
	} = useCalendarController();

	return (
		<div className='flex-1 flex flex-col gap-6 h-full w-full p-6 relative max-w-[720px]'>
			<div className='flex w-fit bg-skyblue-100 items-center sm:space-x-[15px] rounded-xl'>
				{renderViewSwitcher(currentView, handleViewChange)}
			</div>

			<div className='flex flex-col-reverse gap-4 sm:flex-row justify-center items-start sm:items-center sm:justify-between '>
				<div className='flex items-center gap-4 justify-between sm:justify-start'>
					<h2 className='text-skyblue-950 font-bold text-sm sm:text-xl'>
						{dateTitle}
					</h2>
					<div className='flex items-center gap-2'>
						<button
							onClick={handlePrev}
							className='cursor-pointer p-1 text-[#4F85F6] hover:bg-blue-50 rounded-lg transition-colors'>
							<ChevronLeft className='w-6 h-6' />
						</button>
						<button
							onClick={handleNext}
							className='cursor-pointer p-1 text-[#4F85F6] hover:bg-blue-50 rounded-lg transition-colors'>
							<ChevronRight className='w-6 h-6' />
						</button>
					</div>
				</div>

				<button
					onClick={() => setIsModalOpen(true)}
					className='text-sm sm:text-lg cursor-pointer flex items-center gap-2 bg-skyblue-500 hover:bg-[#2563EB] text-white px-2.5 py-1.25 sm:px-5 sm:py-2.5 rounded-xl font-semibold shadow-md transition-colors'>
					Add new <Plus className='w-5 h-5' />
				</button>
			</div>

			<div className='flex-1  bg-white rounded-3xl rounded-bl-none shadow-xl border border-slate-100 overflow-hidden flex flex-col'>
				<div className='flex-1 w-full overflow-x-auto overflow-y-auto'>
					<div className='min-w-[400px] max-h-[620px]'>
						<FullCalendar
							ref={calendarRef}
							plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
							headerToolbar={false}
							initialView='dayGridMonth'
							datesSet={handleDateTitle}
							// -- Events
							events={events}
							editable={true}
							selectable={true}
							selectMirror={true}
							dayMaxEvents={1}
							eventDrop={handleEventDrop}
							eventResize={handleEventResize}
							select={handleDateSelect}
							eventClick={handleEventClick}
							// ----------
							aspectRatio={1.5}
							eventDisplay='block'
							height='auto'
							eventClassNames={(arg) => {
								const isDone = arg.event.extendedProps.done;
								return `border-none text-primary-foreground hover:opacity-90 cursor-pointer
								${isDone ? "opacity-50 line-through grayscale" : ""}
								`;
							}}
						/>
					</div>
				</div>
			</div>

			{/* DIALOG FORMS WILL GO HERE */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className='sm:max-w-[425px] max-h-[90vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle className='text-skyblue-500 text-center font-bold text-xl'>
							{selectedEvent ? "Edit Event" : "Add new Event"}
						</DialogTitle>
					</DialogHeader>

					<DialogDescription className='flex items-center gap-1 text-[#F61212] text-sm font-medium mt-2'>
						<img src={images.star} alt='star' />
						Required fields
					</DialogDescription>

					<EventForm
						selectedEvent={selectedEvent}
						selectedDateRange={selectedDateRange}
						isModalOpen={isModalOpen}
						onSubmitEvent={handleEventSubmit}
						onDeleteEvent={handleEventDelete}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

const renderViewSwitcher = (
	currentView: string,
	handleViewChange: (v: string) => void,
) => {
	return VIEW_TYPES.map((view) => (
		<button
			key={view.value}
			onClick={() => handleViewChange(view.value)}
			className={`sm:w-20 p-2 cursor-pointer font-bold text-skyblue-950 text-sm sm:leading-6 rounded-xl transition-all ${
				currentView === view.value
					? "bg-skyblue-300 shadow-sm"
					: "bg-skyblue-100 hover:text-[#162e54de]"
			}`}>
			{view.label}
		</button>
	));
};

export default CalendarView;
