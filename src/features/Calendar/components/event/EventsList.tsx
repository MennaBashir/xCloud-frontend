import { Button } from "@/components/ui/button";
import { images } from "@/features/Calendar/assets";
import useCalendarEvents from "@/features/Calendar/hooks/useCalendarEvents";
import { EventListItem } from "@/features/Calendar/components";
const EventsList = () => {
	const { events, toggleDone } = useCalendarEvents();
	return (
		<div className='w-[200px] md:w-[300px] lg:w-[400px] h-[780px] bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col'>
			{/* header */}
			<div className='flex-none bg-skyblue-500 h-[140px] md:h-[180px] flex flex-col justify-center gap-2 px-6'>
				<header className='flex items-center gap-2'>
					<img className='w-5 h-5 md:w-8 md:h-8' src={images.bell} alt='bell' />
					<p className='text-[#F29649] font-bold md:text-2xl'>Alerts</p>
				</header>
				{/* notifications */}
				<div className='pl-2 md:pl-11'>
					<p className='text-[#F6F7F9] text-xs md:text-md lg:text-lg font-semibold'>
						johan sent a new task for you
					</p>
				</div>
				<div className='flex justify-end mt-2'>
					<Button className='w-15 h-8 text-xs md:w-20 md:h-10 md:text-md bg-skyblue-200 text-[#7B8DA8] hover:text-[#F6F7F9] hover:bg-skyblue-400 cursor-pointer'>
						View Task
					</Button>
				</div>
			</div>
			{/* events */}
			<div className='flex-1 flex flex-col mt-[17px] px-4 min-h-0 pb-4'>
				<p className='text-md md:text-2xl font-bold text-skyblue-500'>Events</p>
				<div className='flex-1 overflow-y-auto pr-2'>
					<div className='flex flex-col gap-6'>
						{events?.map((event) => (
							<EventListItem
								key={event.id}
								event={event}
								toggleDone={toggleDone}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventsList;
