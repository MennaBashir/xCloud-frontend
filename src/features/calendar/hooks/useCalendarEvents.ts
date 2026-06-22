import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CalendarEvent, CalendarReminder } from "@/features/calendar/types";
import { toast } from "sonner";
import { getTasks } from "@/shared/api/get/task";
import { postTask } from "@/shared/api/post/task";
import { updateTask } from "@/shared/api/put/task";
import { deleteTask } from "@/shared/api/delete/task";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useTranslation } from "react-i18next"
import { useReminder } from "./useReminder";
import { useMemo } from "react";
type UpdatePayload = { id: string } & Partial<CalendarEvent>;
type MutationContext = { previousEvents?: CalendarEvent[] };

export const useCalendarEvents = () => {

    const { t } = useTranslation("calendar");

    const token = useAuthStore((state) => state.token!);
    
    const queryClient = useQueryClient();
    const QUERY_KEY = ["calendar-events"];

    const { data: events = [], isLoading, error , isFetching } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => getTasks({ token }),
    });

    const {reminders, isLoadingReminders} = useReminder();
    
        const mergedEventsWithReminders = useMemo(()=>{
            if (!events || !reminders) return events;
            return events.map(e=>{
                const eventReminders = reminders.filter((r:CalendarReminder)=> r.task_id === e.id);
                return {
                    ...e,
                    hasReminders: eventReminders.length > 0,
                    reminders: eventReminders,
                }
            })
        },[events, reminders])
   
    const addMutation = useMutation<CalendarEvent, Error, CalendarEvent, MutationContext>({
        mutationFn: (event) => postTask({ token, task: event }),
        onMutate: async (newEvent) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEY });
            const previousEvents = queryClient.getQueryData<CalendarEvent[]>(QUERY_KEY);

            queryClient.setQueryData<CalendarEvent[]>(QUERY_KEY, (old = []) => [...old, newEvent]);

            return { previousEvents };
        },
        onError: (_err, _, context) => {
         if (context?.previousEvents !== undefined) {
            queryClient.setQueryData(QUERY_KEY, context.previousEvents);
        } else {
            queryClient.setQueryData(QUERY_KEY, []);
        }
            toast.error(t("events.postError"));
        },
        onSuccess: () => {
            toast.success(t("events.postSuccess"));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });

    const updateMutation = useMutation<CalendarEvent, Error, UpdatePayload, MutationContext>({
        mutationFn: ({ id, ...data }) => updateTask({ token, taskId: id, task: data as CalendarEvent }),
        onMutate: async (updatedEvent) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEY });
            const previousEvents = queryClient.getQueryData<CalendarEvent[]>(QUERY_KEY);

            queryClient.setQueryData<CalendarEvent[]>(QUERY_KEY, (old = []) =>
                old.map((event) =>
                    event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
                )
            );

            return { previousEvents };
        },
        onError: (_err, _, context) => {
            queryClient.setQueryData(QUERY_KEY, context?.previousEvents);
            toast.error(t("events.putError"));
        },
        onSuccess: () => {
            toast.success(t("events.putSuccess"));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });

    const deleteMutation = useMutation<void, Error, string, MutationContext>({
        mutationFn: (id) => deleteTask({ token, taskId: id }),
        onMutate: async (idToDelete) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEY });
            const previousEvents = queryClient.getQueryData<CalendarEvent[]>(QUERY_KEY);

            queryClient.setQueryData<CalendarEvent[]>(QUERY_KEY, (old = []) =>
                old.filter((event) => event.id !== idToDelete)
            );

            return { previousEvents };
        },
        onError: (_err, _, context) => {
            queryClient.setQueryData(QUERY_KEY, context?.previousEvents);
            toast.error(t("events.deleteError"));
        },
        onSuccess: () => {
            toast.success(t("events.deleteSuccess"));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
    return {
        events: mergedEventsWithReminders,
        reminders,
        isLoading: isLoading || isLoadingReminders,
        isFetching,
        error,

        addEvent: async (event: CalendarEvent) => await addMutation.mutateAsync(event),

        deleteEvent: (id: string) => deleteMutation.mutate(id),

        updateEvent: (id: string, event: CalendarEvent) =>
            updateMutation.mutate({ ...event, id }),

        resizeEvent: (id: string, newEnd: string | Date) =>
            updateMutation.mutate({ id, end: newEnd }),

        dropEvent: (id: string, newStart: string | Date, newEnd: string | Date) =>
            updateMutation.mutate({ id, start: newStart, end: newEnd }),

        toggleDone: (id: string) => {
            const eventToToggle = events.find((e) => e.id === id);
            if (eventToToggle) {
                updateMutation.mutate({ id, done: !eventToToggle.done });
            }
        },
    };
};

export default useCalendarEvents;