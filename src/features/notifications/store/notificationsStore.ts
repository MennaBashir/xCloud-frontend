import { create } from "zustand";

import type { Notification } from "../types/notification";

type NotificationsState = {
	notifications: Notification[];
	loading: boolean;
	hasHydrated: boolean;
};

type NotificationsActions = {
	setNotifications: (next: Notification[]) => void;
	setLoading: (loading: boolean) => void;
	prependNotification: (n: Notification) => void;
	patchNotification: (id: string, patch: Partial<Notification>) => void;
	removeNotification: (id: string) => void;
	markAll: () => void;
};

export const useNotificationsStore = create<
	NotificationsState & NotificationsActions
>((set) => ({
	notifications: [],
	loading: true,
	hasHydrated: false,

	setNotifications: (notifications) =>
		set({ notifications, hasHydrated: true }),
	setLoading: (loading) => set({ loading }),
	prependNotification: (n) =>
		set((s) => ({ notifications: [n, ...s.notifications] })),
	patchNotification: (id, patch) =>
		set((s) => ({
			notifications: s.notifications.map((n) =>
				n.id === id ? { ...n, ...patch } : n,
			),
		})),
	removeNotification: (id) =>
		set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
	markAll: () =>
		set((s) => ({
			notifications: s.notifications.map((n) => ({ ...n, read: true })),
		})),
}));

/** Stable empty array reference — never return a fresh `[]` from a selector. */
const EMPTY: readonly Notification[] = Object.freeze([]);

export const selectNotifications = (
	s: NotificationsState & NotificationsActions,
): readonly Notification[] => s.notifications ?? EMPTY;

export const selectUnreadCount = (
	s: NotificationsState & NotificationsActions,
): number => s.notifications.filter((n) => !n.read).length;

export const selectLoading = (
	s: NotificationsState & NotificationsActions,
): boolean => s.loading;
