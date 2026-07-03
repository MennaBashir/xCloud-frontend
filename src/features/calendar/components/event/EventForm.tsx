import { zodResolver } from "@hookform/resolvers/zod";
import { BellRing, Clock, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
import { getFormSchema } from "@/features/calendar/schemas/eventFormSchema";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    ColorPicker,
    DatePicker,
    DeleteEventDialog,
} from "@/features/calendar/components";
import {
    type EventFormValues,
} from "@/features/calendar/schemas/eventFormSchema";
import type { CalendarEvent, CalendarReminder } from "@/features/calendar/types";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
import { useLocalReminders } from "../../hooks/useLocalReminders";

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
    const translatedSchema = useMemo(() => getFormSchema(t), [t]);
    const { t: tc } = useTranslation();
    const { language } = useLanguage();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Zustand State
    const { reminders, initReminders, addReminder, removeReminder } = useLocalReminders();

    // Dialog State
    const [isAddingReminder, setIsAddingReminder] = useState(false);
    const [newReminderTime, setNewReminderTime] = useState<string>("");


    const form = useForm<EventFormValues>({
        resolver: zodResolver(translatedSchema),
        defaultValues: {
            title: "",
            description: "",
            start: "",
            end: "",
            allDay: false,
            done: false,
            backgroundColor: DEFAULT_COLOR,
            borderColor: "#fff",
			reminders: [],
        },
    });

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
					reminders: selectedEvent.reminders || [],
                });
                initReminders(selectedEvent.reminders || []);

            } else if (selectedDateRange) {
                const startDate = new Date(selectedDateRange.start);
                startDate.setHours(9, 0, 0);
                const endDate = new Date(selectedDateRange.end);
                if (startDate.getDate() === endDate.getDate())
                    endDate.setHours(10, 0, 0);
                else endDate.setHours(9, 0, 0);
                
                initReminders([]);
                
                form.reset({
                    title: "",
                    description: "",
                    start: startDate.toISOString(),
                    end: endDate.toISOString(),
                    allDay: false,
                    done: false,
                    backgroundColor: DEFAULT_COLOR,
                    borderColor: "#fff",
					reminders: [],
                });
            } else {
                initReminders([]);
                form.reset({
                    title: "",
                    description: "",
                    start: "",
                    end: "",
                    allDay: false,
                    done: false,
                    backgroundColor: DEFAULT_COLOR,
                    borderColor: "#fff",
					reminders: [],
                });
            }
        }
    }, [isModalOpen, selectedEvent, selectedDateRange, form]);

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
            reminders: reminders,
        } as CalendarEvent);
    };

    const isAllDay = form.watch("allDay");

const formatReminderDate = (isoString: string) => {
        if (!isoString) return "";
        const safeString = isoString.endsWith("Z") ? isoString : `${isoString}Z`;
        const date = new Date(safeString);
        
        if (Number.isNaN(date.getTime())) return "";
        return new Intl.DateTimeFormat(language, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }).format(date);
    };

    // The reminder DatePicker lives outside react-hook-form, so we hand it a
    // field-shaped object with the same properties RHF would provide. This lets
    // us reuse the same DatePicker without wiring a real form field.
    const fakeFieldProps: ControllerRenderProps = {
        value: newReminderTime,
        onChange: (value: string) => setNewReminderTime(value),
        onBlur: () => {},
        name: "tempReminderTime",
        ref: () => {},
    };

    return (
        <>
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

                    {/* Reminders List */}
                    <div className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-surface-muted/20 p-3.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BellRing className="size-4 text-muted-foreground" />
                                <Label className="text-[0.875rem] font-medium text-foreground">
                                    {t("form.remindersList")}
                                </Label>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 gap-1 text-xs"
                                onClick={() => {
                                    const suggested = new Date(form.getValues("start") || new Date());
                                    suggested.setMinutes(suggested.getMinutes() - 15);
                                    setNewReminderTime(suggested.toISOString());
                                    setIsAddingReminder(true);
                                }}
                            >
                                <Plus className="size-3" />
                                {t("actions.add")}
                            </Button>
                        </div>

                        <div className="flex flex-col gap-2 mt-1">
                            {reminders.length === 0 ? (
                                <span className="text-xs text-muted-foreground text-center py-2">
                                    {t("form.noReminders")}
                                </span>
                            ) : (
                                reminders.map((r, index) => (
                                    <div key={r.id || index} className="flex items-center justify-between gap-2 p-2 rounded border bg-background animate-in fade-in slide-in-from-top-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="size-3.5" />
                                        	<span>{formatReminderDate(r.remind_at as string)}</span>
                                    	</div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                                            onClick={() => removeReminder(r)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
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

            <Dialog open={isAddingReminder} onOpenChange={setIsAddingReminder}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("form.addReminderTitle")}</DialogTitle>
                        <DialogDescription>
                            {t("form.addReminderDesc")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-1.5 py-4">
                        <Label className="text-[0.8125rem] font-medium">
                            {t("form.remindAt")}
                        </Label>
                        {/* fakeFieldProps stands in for a react-hook-form field */}
                        <DatePicker
                            disabled={false}
                            fieldValidation={fakeFieldProps}
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">{t("actions.cancel")}</Button>
                        </DialogClose>
                        <Button
                            onClick={() => {
                                if (newReminderTime) {
                                    addReminder({
                                        id: `temp-${Date.now()}`,
                                        task_id: selectedEvent?.id || "",
                                        remind_at: newReminderTime,
                                    } as CalendarReminder);
                                }
                                setIsAddingReminder(false);
                            }}
                        >
                            {t("actions.addReminder")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EventForm;