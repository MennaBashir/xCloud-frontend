import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
	ColorPicker,
	DatePicker,
	DeleteEventDialog,
} from "@/features/calendar/components";
import {
	type EventFormValues,
	formSchema,
} from "@/features/calendar/schemas/eventFormSchema";
import type { CalendarEvent } from "@/features/calendar/types";

const DEFAULT_COLOR = "oklch(0.62 0.19 245)";

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
	const { t } = useTranslation("calendar");
	const { t: tc } = useTranslation();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const form = useForm<EventFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			start: "",
			end: "",
			allDay: false,
			done: false,
			backgroundColor: DEFAULT_COLOR,
			borderColor: "#fff",
		},
	});

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
				form.reset({
					title: selectedEvent.title,
					description: selectedEvent.description || "",
					start: new Date(selectedEvent.start).toISOString(),
					end: new Date(selectedEvent.end).toISOString(),
					allDay: selectedEvent.allDay || false,
					done: selectedEvent.done || false,
					backgroundColor: selectedEvent.backgroundColor || DEFAULT_COLOR,
					borderColor: selectedEvent.borderColor || "#fff",
				});
			} else if (selectedDateRange) {
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
					backgroundColor: DEFAULT_COLOR,
					borderColor: "#fff",
				});
			} else {
				form.reset({
					title: "",
					description: "",
					start: "",
					end: "",
					allDay: false,
					done: false,
					backgroundColor: DEFAULT_COLOR,
					borderColor: "#fff",
				});
			}
		}
	}, [isModalOpen, selectedEvent, selectedDateRange, form]);

	const isAllDay = form.watch("allDay");

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4 mt-2"
			>
				{/* Title */}
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-1.5">
							<Label className="text-[0.8125rem] font-medium">
								{t("form.title")}
							</Label>
							<FormControl>
								<Input
									placeholder={t("form.titlePlaceholder")}
									{...field}
								/>
							</FormControl>
							<FormMessage className="text-[0.75rem] text-destructive" />
						</FormItem>
					)}
				/>

				{/* All day */}
				<FormField
					control={form.control}
					name="allDay"
					render={({ field }) => (
						<FormItem
							className={cn(
								"flex items-center justify-between gap-3",
								"rounded-[var(--radius-md)] border border-border bg-surface-muted/40 px-3.5 py-2.5",
							)}
						>
							<Label className="text-[0.875rem] font-medium text-foreground">
								{t("form.allDay")}
							</Label>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				{/* Start / End */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="start"
						render={({ field, fieldState }) => (
							<FormItem className="flex flex-col gap-1.5">
								<Label className="text-[0.8125rem] font-medium">
									{t("form.start")}
								</Label>
								<FormControl>
									<DatePicker
										disabled={isAllDay}
										fieldValidation={field}
										isInvalid={fieldState.invalid}
									/>
								</FormControl>
								<FormMessage className="text-[0.75rem] text-destructive" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="end"
						render={({ field, fieldState }) => (
							<FormItem className="flex flex-col gap-1.5">
								<Label className="text-[0.8125rem] font-medium">
									{t("form.end")}
								</Label>
								<FormControl>
									<DatePicker
										disabled={isAllDay}
										fieldValidation={field}
										isInvalid={fieldState.invalid}
									/>
								</FormControl>
								<FormMessage className="text-[0.75rem] text-destructive" />
							</FormItem>
						)}
					/>
				</div>

				{/* Color */}
				<FormField
					control={form.control}
					name="backgroundColor"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-1.5">
							<Label className="text-[0.8125rem] font-medium">
								{t("form.color")}
							</Label>
							<FormControl>
								<ColorPicker
									value={field.value || DEFAULT_COLOR}
									onChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				{/* Description */}
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-1.5">
							<Label className="text-[0.8125rem] font-medium">
								{t("form.description")}
							</Label>
							<FormControl>
								<Textarea
									placeholder={t("form.descriptionPlaceholder")}
									rows={3}
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
						name="done"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="flex items-center gap-2.5">
										<Checkbox
											id="done"
											checked={field.value}
											onCheckedChange={field.onChange}
											className="size-4"
										/>
										<Label
											htmlFor="done"
											className="text-[0.875rem] font-medium"
										>
											{t("form.done")}
										</Label>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
				)}

				{/* Actions */}
				<div className="flex items-center justify-between gap-2 pt-2">
					<Button type="submit" className="flex-1">
						{selectedEvent ? t("form.update") : t("form.save")}
					</Button>
					{selectedEvent ? (
						<>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => setIsDeleteModalOpen(true)}
								className="text-destructive hover:bg-destructive/10"
								aria-label={tc("actions.delete")}
							>
								<Trash2 className="size-4" strokeWidth={1.6} />
							</Button>
							<DeleteEventDialog
								open={isDeleteModalOpen}
								onOpenChange={setIsDeleteModalOpen}
								onConfirm={() => onDeleteEvent?.()}
							/>
						</>
					) : null}
				</div>
			</form>
		</Form>
	);
};

export default EventForm;
