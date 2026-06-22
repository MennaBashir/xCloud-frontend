import { useAuthStore } from "@/features/auth/store/authStore";
import { deleteReminder } from "@/shared/api/delete/reminder";
import { getReminders } from "@/shared/api/get/reminder";
import { postReminder, type CreateReminderPayload } from "@/shared/api/post/reminder";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export const useReminder = () => {

    const { t } = useTranslation("calendar");

    const token = useAuthStore((state) => state.token!);
    
    const QUERY_KEY = ["calendar-reminders"];
    const queryClient = useQueryClient();

    const {data: reminders = [], isLoading: isLoadingReminders, error: reminderError} = useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => getReminders({ token }),
    })
    
    const addMutation = useMutation({
        mutationFn: (reminder: CreateReminderPayload) => postReminder({ token, reminder }),
        onError: () => {
            console.error(t("reminders.addError"));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    })

    const removeMutation = useMutation({
        mutationFn: (reminderId: string) => deleteReminder({ token, task_id: reminderId }),
        onError: () => {
            console.error(t("reminders.deleteError"));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    })

    return {
        reminderError, 
        reminders, 
        isLoadingReminders,
        isAddingReminder: addMutation.isPending,
        isRemovingReminder: removeMutation.isPending,
        addReminder: (reminder: CreateReminderPayload) => addMutation.mutate(reminder),
        removeReminder: (reminderId: string) => removeMutation.mutate(reminderId),
    };
}