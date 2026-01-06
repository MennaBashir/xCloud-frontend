import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useState } from "react";
import { type ControllerRenderProps } from "react-hook-form";
import { HourPicker } from "@/features/Calendar/components";
import { images } from "@/features/Calendar/assets";

interface DatePickerProps {
	isRequired?: boolean;
	fieldValidation: ControllerRenderProps<any, any>;
	isInvalid?: boolean;
	disabled?: boolean;
}

const DatePicker = ({
	isRequired = false,
	fieldValidation,
	isInvalid = false,
	disabled = false,
}: DatePickerProps) => {
	const [open, setOpen] = useState(false);

	const parsedDate = fieldValidation.value
		? new Date(fieldValidation.value)
		: undefined;

	const currentHours = parsedDate
		? parsedDate.toTimeString().slice(0, 5)
		: "12:00";
	// handlers
	const handleTimeChange = (time: string) => {
		const baseDate = parsedDate ? new Date(parsedDate) : new Date();

		if (!disabled) {
			const [h, m] = time.split(":").map(Number);
			baseDate.setHours(h);
			baseDate.setMinutes(m);
			baseDate.setSeconds(0);

			fieldValidation.onChange(baseDate.toISOString());
		} else {
			fieldValidation.onChange(baseDate.toISOString().split("T")[0]);
		}
	};

	const handleSelectDate = (date: Date | undefined) => {
		if (date) {
			const baseDate = new Date(date);
			const [h, m] = currentHours.split(":").map(Number);
			baseDate.setHours(h);
			baseDate.setMinutes(m);
			baseDate.setSeconds(0);

			fieldValidation.onChange(baseDate.toISOString());
		}
	};
	// formaters
	function formatDateTime(dateString: string | Date | undefined) {
		if (!dateString) return "";
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return "";

		if (!disabled)
			return date.toLocaleString("en-US", {
				month: "long",
				day: "2-digit",
				year: "numeric",
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			});
		else
			return date.toLocaleDateString("en-US", {
				month: "long",
				day: "2-digit",
				year: "numeric",
			});
	}
	return (
		<div className='flex flex-col gap-3'>
			<div className='relative flex gap-2'>
				<InputGroup
					className={`border-none bg-[#EDEEF2] py-2 rounded-lg w-full placeholder:text-[#64748B] font-medium
          ${isInvalid ? "ring-1 ring-[#F61212]" : "ring-1 ring-transparent"}
          `}>
					<InputGroupInput
						id='date'
						placeholder='Select date'
						readOnly
						className='cursor-pointer'
						onClick={() => setOpen(true)}
						value={formatDateTime(fieldValidation.value)}
					/>
					{isRequired && (
						<InputGroupAddon>
							<img src={images.star} alt='required' className='w-2 h-2 mt-1' />
						</InputGroupAddon>
					)}
				</InputGroup>

				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							id='date-picker'
							variant='ghost'
							className='absolute top-1/2 right-2 size-12 -translate-y-1/2 hover:bg-transparent cursor-pointer'>
							<div className='flex gap-2 text-[#64748B]'>
								<CalendarDays />
								<ChevronDown />
							</div>
							<span className='sr-only'>Select date</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className='w-auto overflow-hidden p-0'
						align='end'
						alignOffset={-8}
						sideOffset={10}>
						<Calendar
							mode='single'
							selected={parsedDate}
							captionLayout='dropdown'
							fromDate={new Date("1900-01-01")}
							toDate={new Date("2100-01-01")}
							onSelect={handleSelectDate}
						/>
						{!disabled && (
							<HourPicker
								disabled={disabled}
								value={currentHours}
								onChange={handleTimeChange}
							/>
						)}
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};

export default DatePicker;
