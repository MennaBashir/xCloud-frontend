import { create } from "zustand";
import type { CalendarReminder } from "../types";

interface LocalRemindersState {
    reminders: CalendarReminder[];
    deletedIds: string[];
    
    initReminders: (reminders: CalendarReminder[]) => void;
    addReminder: (reminder: CalendarReminder) => void;
    removeReminder: (reminder: CalendarReminder) => void;
    clearLocalReminders: () => void;
}

export const useLocalReminders = create<LocalRemindersState>((set, get) => ({
    reminders: [],
    deletedIds: [],
    
    initReminders: (reminders) => set({ reminders, deletedIds: [] }),
    
    addReminder: (reminder) => set({ reminders: [...get().reminders, reminder] }),
    
    removeReminder: (reminder) => {
        const state = get();

        const isTemp = String(reminder.id).startsWith("temp-");
        
        set({
            reminders: state.reminders.filter((r) => r.id !== reminder.id),
            deletedIds: isTemp ? state.deletedIds : [...state.deletedIds, reminder.id as string],
        });
    },
    
    clearLocalReminders: () => set({ reminders: [], deletedIds: [] }),
}));