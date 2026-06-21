import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CalendarEvent } from "@/features/calendar/types";
import { toast } from "sonner";
import { getTasks } from "@/shared/api/get/task";
import { postTask } from "@/shared/api/post/task";
import { updateTask } from "@/shared/api/put/task";
import { deleteTask } from "@/shared/api/delete/task";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useTranslation } from "react-i18next"

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


    const addMutation = useMutation<CalendarEvent, Error, CalendarEvent, MutationContext>({
        mutationFn: (event) => postTask({ token, task: event }),
        onMutate: async (newEvent) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEY });
            const previousEvents = queryClient.getQueryData<CalendarEvent[]>(QUERY_KEY);

            queryClient.setQueryData<CalendarEvent[]>(QUERY_KEY, (old = []) => [...old, newEvent]);

            return { previousEvents };
        },
        onError: (e_rr, _, context) => {
         if (context?.previousEvents !== undefined) {
            queryClient.setQueryData(QUERY_KEY, context.previousEvents);
        } else {
            queryClient.setQueryData(QUERY_KEY, []);
        }
            toast.error(t("postError"));
        },
        onSuccess: () => {
            toast.success(t("postSuccess"));
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
        onError: (err, _, context) => {
            queryClient.setQueryData(QUERY_KEY, context?.previousEvents);
            toast.error(t("putError"));
        },
        onSuccess: () => {
            toast.success(t("putSuccess"));
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
        onError: (err, _, context) => {
            queryClient.setQueryData(QUERY_KEY, context?.previousEvents);
            toast.error(t("deleteError"));
        },
        onSuccess: () => {
            toast.success(t("deleteSuccess"));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
    return {
        events,
        isLoading,
        isFetching,
        error,

        addEvent: (event: CalendarEvent) => addMutation.mutate(event),

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