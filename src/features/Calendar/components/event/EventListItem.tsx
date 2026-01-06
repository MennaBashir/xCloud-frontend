import { Switch } from "@/components/ui/switch";
import { CalendarDays } from "lucide-react";
import { images } from "@/features/Calendar/assets";
import { getColorName } from "@/features/Calendar/lib/colorsUtils";
import type { CalendarEvent } from "@/features/Calendar/types";
import { memo } from "react";

interface EventListItemProps {
	event: CalendarEvent;
	toggleDone: (id: string) => void;
}

const switchStyles = `w-[50px] h-4 md:w-[58px] md:h-5
                relative
                [&>span]:h-4 md:[&>span]:h-5 
                [&>span]:w-4 md:[&>span]:w-5
                [&>span]:transition-transform
                [&>span]:data-[state=checked]:translate-x-8
                md:[&>span]:data-[state=checked]:translate-x-[36.5px]
                border-transparent
                data-[state=unchecked]:bg-[#64748B]
                data-[state=unchecked]:after:content-['Done']
                data-[state=unchecked]:after:absolute
                data-[state=unchecked]:after:left-4.5
                md:data-[state=unchecked]:after:left-5.5
                data-[state=unchecked]:after:top-0
                data-[state=unchecked]:after:text-white
                data-[state=unchecked]:after:text-[10px]
                md:data-[state=unchecked]:after:text-[12px]
                data-[state=unchecked]:after:animate-in
                data-[state=unchecked]:after:fade-in-0
                data-[state=checked]:bg-[#F29649]
                data-[state=checked]:after:content-['Done']
                data-[state=checked]:after:absolute
                data-[state=checked]:after:left-1.5
                data-[state=checked]:after:top-0
                data-[state=checked]:after:text-white
                data-[state=checked]:after:text-[10px]
                md:data-[state=checked]:after:text-[12px]
                data-[state=checked]:after:font-semibold
                data-[state=checked]:after:animate-in
                data-[state=checked]:after:fade-in-0`;

const EventListItem = memo(({ event, toggleDone }: EventListItemProps) => {
	const { title, start, end, backgroundColor, done } = event;
	return (
		<div>
			<div className='flex flex-col gap-4 mt-2'>
				{/* name */}
				<div>
					<div className='flex justify-between items-center mb-3'>
						<p className='font-semibold text-xs md:text-lg'>{title}</p>
						<Switch
							onCheckedChange={() => toggleDone(event.id)}
							checked={done || false}
							className={switchStyles}
						/>
					</div>

					<div className='flex justify-between items-start gap-4'>
						{/* --- LEFT SIDE (Start Date & Color) --- */}
						<div className='flex gap-3'>
							{/* col-1 */}
							<div className='flex flex-col items-center'>
								<CalendarDays size={20} className='text-[#31C0B1]' />
								<div className='flex-1 w-0.5 border-l-2 border-dashed border-[#31C0B1] my-1 min-h-10'></div>
								<img
									className='w-6 h-6'
									src={images.colorWheel}
									alt='color-wheel'
								/>
							</div>
							{/* col-2 */}
							<div className='flex flex-col justify-between gap-6'>
								{/* Start Date Text */}
								<div className='flex flex-col'>
									<p className='text-[#64748B] text-xs md:text-sm font-medium'>
										Start date
									</p>
									<p className='text-skyblue-950 font-bold text-xs md:text-sm leading-tight'>
										{start.toLocaleString().split("T")[0]}
									</p>
								</div>

								<div className='flex md:hidden flex-col'>
									<p className='text-[#64748B] text-xs md:text-sm font-medium'>
										End date
									</p>
									<p className='text-skyblue-950 font-bold text-xs md:text-sm leading-tight'>
										{end.toLocaleString().split("T")[0]}
									</p>
								</div>

								{/* Color Text */}
								<div className='flex flex-col'>
									<p className='text-[#64748B] text-xs md:text-sm font-medium'>
										Color
									</p>
									<div className='flex items-center gap-2'>
										<div
											className='w-4 h-4 rounded-full'
											style={{ backgroundColor }}></div>
										<p className='text-skyblue-950 font-bold text-xs md:text-sm leading-tight'>
											{getColorName(backgroundColor!)}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* --- RIGHT SIDE (End Date) --- */}
						<div className='hidden md:flex items-start gap-2.5'>
							<CalendarDays size={20} className='text-[#31C0B1]' />
							<div className='flex flex-col gap-0'>
								<p className='text-[#64748B] text-sm font-medium'>End date</p>
								<p className='text-skyblue-950 font-bold text-sm leading-tight'>
									{end.toLocaleString().split("T")[0]}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

export default EventListItem;
