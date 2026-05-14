import { useState } from "react";
import { type ControllerRenderProps } from "react-hook-form";
import { CalendarDays, ChevronDown } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
import { HourPicker } from "@/features/calendar/components";

interface DatePickerProps {
	isRequired?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fieldValidation: ControllerRenderProps<any, any>;
	isInvalid?: boolean;
	disabled?: boolean;
}

const DatePicker = ({
	fieldValidation,
	isInvalid = false,
	disabled = false,
}: DatePickerProps) => {
	const { language } = useLanguage();
	const [open, setOpen] = useState(false);

	const parsedDate = fieldValidation.value
		? new Date(fieldValidation.value)
		: undefined;

	const currentHours = parsedDate
		? parsedDate.toTimeString().slice(0, 5)
		: "12:00";

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

	function formatDateTime(dateString: string | Date | undefined) {
		if (!dateString) return "";
		const date = new Date(dateString);
		if (Number.isNaN(date.getTime())) return "";
		try {
			return new Intl.DateTimeFormat(language, {
				month: "short",
				day: "2-digit",
				year: "numeric",
				hour: disabled ? undefined : "numeric",
				minute: disabled ? undefined : "2-digit",
			}).format(date);
		} catch {
			return date.toLocaleString();
		}
	}

	const displayValue = formatDateTime(fieldValidation.value);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						"inline-flex items-center gap-2 w-full px-3.5 h-10",
						"rounded-[var(--radius-md)] border bg-surface-elevated",
						"text-[0.875rem] text-foreground",
						"hover:border-border-strong transition-colors duration-[var(--duration-fast)]",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
						isInvalid ? "border-destructive" : "border-border",
					)}
				>
					<CalendarDays
						className="size-3.5 text-muted-foreground shrink-0"
						strokeWidth={1.6}
					/>
					<span
						className={cn(
							"flex-1 text-start truncate",
							!displayValue && "text-muted-foreground",
						)}
					>
						{displayValue || "Select date"}
					</span>
					<ChevronDown
						className="size-3.5 text-muted-foreground"
						strokeWidth={1.6}
					/>
				</button>
			</PopoverTrigger>
			<PopoverContent
				className="w-auto overflow-hidden p-0"
				align="start"
				sideOffset={6}
			>
				<Calendar
					mode="single"
					selected={parsedDate}
					captionLayout="dropdown"
					fromDate={new Date("1900-01-01")}
					toDate={new Date("2100-01-01")}
					onSelect={handleSelectDate}
				/>
				{!disabled ? (
					<HourPicker
						disabled={disabled}
						value={currentHours}
						onChange={handleTimeChange}
					/>
				) : null}
			</PopoverContent>
		</Popover>
	);
};

export default DatePicker;
