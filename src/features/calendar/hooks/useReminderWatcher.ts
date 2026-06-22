import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import useCalendarEvents from "./useCalendarEvents";

export const useReminderWatcher = () => {

    const {t} = useTranslation("calendar")
    const { events } = useCalendarEvents();

    const notifiedSet = useRef<Set<string>>(new Set());

    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }

        const interval = setInterval(() => {
            const now = new Date();

            events.forEach((event) => {
                if (!event.reminders || event.reminders.length === 0) return;

                event.reminders.forEach((reminder) => {
                    const reminderId = reminder.id || `${event.id}-${reminder.remind_at}`;
                    if (notifiedSet.current.has(reminderId)) return;

                    const rawTime = reminder.remind_at as string;
                    const safeString = rawTime.endsWith("Z") ? rawTime : `${rawTime}Z`;
                    const remindTime = new Date(safeString);
                    
                    const diff = now.getTime() - remindTime.getTime();

                    if (diff >= 0 && diff < 60000) {
                        triggerNotification(
                            t('reminder.title'),
                            t("reminder.body", { title: event.title })
                        );
                        notifiedSet.current.add(reminderId);
                    }
                });
            });
        }, 10000);

        return () => clearInterval(interval);
    }, [events]);

    const triggerNotification = (title: string, body: string) => {
        try {
            const audio = new Audio("/sound-effects/reminder.mp3");
            audio.volume = 0.5;
            audio.play().catch((err) => console.log("sound error", err));
        } catch (error) {
            console.error("sound error", error);
        }
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, { 
                body, 
                icon: "/favicon.svg", 
                requireInteraction: true 
            });
        } else {
            toast(title, {
                description: body,
                duration: 10000,
            });

        console.log("notification",title,body);
        }
    };
};