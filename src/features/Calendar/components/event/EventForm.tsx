import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	ColorPicker,
	DatePicker,
	DeleteEventDialog,
} from "@/features/Calendar/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { images } from "@/features/Calendar/assets";
import {
	type EventFormValues,
	formSchema,
} from "@/features/Calendar/schemas/eventFormSchema";
import type { CalendarEvent } from "@/features/Calendar/types";

interface CalendarFormProps {
	selectedEvent: CalendarEvent | null;
	selectedDateRange: {
		start: string | Date;
		end: string | Date;
	} | null;
	isModalOpen: boolean;
	onSubmitEvent: (data: CalendarEvent) => void;
	onDeleteEvent?: () => void;
}

const EventForm = ({
	selectedEvent,
	selectedDateRange,
	isModalOpen,
	onSubmitEvent,
	onDeleteEvent,
}: CalendarFormProps) => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	// --- FORM Definition ---
	const form = useForm<EventFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			start: "",
			end: "",
			allDay: false,
			done: false,
			backgroundColor: "#3B82F6",
			borderColor: "#fff",
		},
	});

	// --- FORM Submit Handler ---
	const onSubmit = (data: EventFormValues) => {
		let finalStart = data.start;
		let finalEnd = data.end;
		if (data.allDay) {
			finalStart = finalStart.split("T")[0];
			finalEnd = finalEnd.split("T")[0];
		}
		onSubmitEvent({
			...data,
			start: finalStart,
			end: finalEnd,
		} as CalendarEvent);
	};

	useEffect(() => {
		if (isModalOpen) {
			if (selectedEvent) {
				// --- EDIT MODE ---
				form.reset({
					title: selectedEvent.title,
					description: selectedEvent.description || "",
					start: new Date(selectedEvent.start).toISOString(),
					end: new Date(selectedEvent.end).toISOString(),
					allDay: selectedEvent.allDay || false,
					done: selectedEvent.done || false,
					backgroundColor: selectedEvent.backgroundColor || "#3B82F6",
					borderColor: selectedEvent.borderColor || "#fff",
				});
			} else if (selectedDateRange) {
				// --- ADD MODE (With Date Selected) ---
				const startDate = new Date(selectedDateRange.start);
				startDate.setHours(9, 0, 0);
				const endDate = new Date(selectedDateRange.end);
				if (startDate.getDate() === endDate.getDate())
					endDate.setHours(10, 0, 0);
				else endDate.setHours(9, 0, 0);
				form.reset({
					title: "",
					description: "",
					start: startDate.toISOString(),
					end: endDate.toISOString(),
					allDay: false,
					done: false,
					backgroundColor: "#3B82F6",
					borderColor: "#fff",
				});
			} else {
				// --- ADD MODE (Manual Button Click) ---
				form.reset({
					title: "",
					description: "",
					start: "",
					end: "",
					allDay: false,
					done: false,
					backgroundColor: "#3B82F6",
					borderColor: "#fff",
				});
			}
		}
	}, [isModalOpen, selectedEvent, selectedDateRange, form]);

	const isAllDay = form.watch("allDay");
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-9 mt-1'>
				{/* Title */}
				<FormField
					control={form.control}
					name='title'
					render={({ field, fieldState }) => (
						<FormItem>
							<FormControl
								className={`focus-visible:ring-skyblue-500 focus-visible:ring-2 border-none bg-[#EDEEF2] py-2 rounded-lg w-full placeholder:text-[#64748B] font-medium ${
									fieldState.invalid
										? "ring-1 ring-[#F61212]"
										: "ring-1 ring-transparent"
								}`}>
								<InputGroup>
									<InputGroupInput placeholder='Name' {...field} />
									<InputGroupAddon align='inline-start'>
										<img src={images.star} alt='star' />
									</InputGroupAddon>
								</InputGroup>
							</FormControl>
							<FormMessage className='text-[#F61212] text-xs font-semibold' />
						</FormItem>
					)}
				/>
				{/* allDay */}
				<FormField
					control={form.control}
					name='allDay'
					render={({ field }) => (
						<FormItem className='ring-1 ring-transparent focus-visible:ring-skyblue-500 focus-visible:ring-2 border-none bg-[#EDEEF2] py-2 px-4 rounded-lg w-full flex items-center justify-between text-[#64748B] font-medium'>
							<p>Spans all day</p>
							<FormControl>
								<Switch
									className='data-[state=checked]:bg-skyblue-500 data-[state=unchecked]:bg-[#64748B]'
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* start date */}
				<FormField
					control={form.control}
					name='start'
					render={({ field, fieldState }) => (
						<FormItem>
							<FormControl>
								<DatePicker
									disabled={isAllDay}
									fieldValidation={field}
									isRequired
									isInvalid={fieldState.invalid}
								/>
							</FormControl>
							<FormMessage className='text-[#F61212] text-xs font-semibold' />
						</FormItem>
					)}
				/>
				{/* end date */}
				<FormField
					control={form.control}
					name='end'
					render={({ field, fieldState }) => (
						<FormItem>
							<FormControl>
								<DatePicker
									disabled={isAllDay}
									fieldValidation={field}
									isRequired
									isInvalid={fieldState.invalid}
								/>
							</FormControl>
							<FormMessage className='text-[#F61212] text-xs font-semibold' />
						</FormItem>
					)}
				/>
				{/* Background Color Field */}
				<FormField
					control={form.control}
					name='backgroundColor'
					render={({ field }) => (
						<FormItem>
							<FormControl className='ring-1 ring-transparent focus-visible:ring-skyblue-500 focus-visible:ring-2 border-none bg-[#EDEEF2] py-2 rounded-lg w-full placeholder:text-[#64748B] font-medium'>
								<ColorPicker
									value={field.value || "#3B82F6"}
									onChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Description */}
				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea
									placeholder='Description'
									className='ring-1 ring-transparent focus-visible:ring-skyblue-500 focus-visible:ring-2 border-none bg-[#EDEEF2] py-2 rounded-lg w-full placeholder:text-[#64748B] font-medium'
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				{/* Done */}
				{selectedEvent && (
					<FormField
						control={form.control}
						name='done'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className='flex items-center gap-3'>
										<Checkbox
											className='w-6 h-6 data-[state=checked]:bg-skyblue-500 data-[state=checked]:border-skyblue-500'
											checked={field.value}
											onCheckedChange={field.onChange}
											id='done'
										/>
										<Label htmlFor='done' className='font-semibold text-md'>
											Mark as done
										</Label>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<div className='flex justify-between gap-4'>
					<Button
						type='submit'
						className='bg-skyblue-200 cursor-pointer text-[#64748B] hover:bg-skyblue-200 hover:text-skyblue-500 px-5 py-[25px] rounded-xl font-semibold text-lg shadow-md transition-colors flex-1'>
						{selectedEvent ? "Edit event" : "Add event"}
					</Button>
					{selectedEvent && (
						<>
							<Button
								onClick={() => setIsDeleteModalOpen(true)}
								variant={"ghost"}
								className='cursor-pointer w-[50px] h-[50px] bg-[#FFEDED] hover:bg-[#FFEDED] rounded-xl flex items-center justify-center'>
								<Trash2 className='w-full h-full text-[#F61212]' />
							</Button>
							<DeleteEventDialog
								open={isDeleteModalOpen}
								onOpenChange={setIsDeleteModalOpen}
								onConfirm={() => onDeleteEvent?.()}
							/>
						</>
					)}
				</div>
			</form>
		</Form>
	);
};

export default EventForm;
