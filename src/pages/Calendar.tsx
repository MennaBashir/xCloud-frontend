import {
	CalendarView,
	EventsList,
	ResponsiveModal,
} from "@/features/Calendar/components";

const CalendarPage = () => {
	return (
		<div className='relative min-h-screen bg-background text-foreground flex items-start justify-center gap-20 lg:p-6'>
			<CalendarView />
			<ResponsiveModal>
				<EventsList />
			</ResponsiveModal>
		</div>
	);
};

export default CalendarPage;
