/**
 * Notifications service.
 *
 * This is the single place the rest of the app talks to for notifications.
 * Right now there is no backend, so every call resolves with empty/no-op
 * results instead of fake seed data. When the real API is ready, only this
 * file changes — the store, hooks, and UI stay the same.
 */
import type { Notification } from "../types/notification";

/** Fetch the current user's notifications. Empty until the backend exists. */
export async function listNotifications(): Promise<Notification[]> {
	return [];
}

/** Mark a single notification as read on the server. */
export async function markRead(_id: string): Promise<void> {
	// No-op until the backend exists.
}

/** Mark every notification as read on the server. */
export async function markAllRead(): Promise<void> {
	// No-op until the backend exists.
}

/** Remove a notification on the server. */
export async function dismissNotification(_id: string): Promise<void> {
	// No-op until the backend exists.
}
