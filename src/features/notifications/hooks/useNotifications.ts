import { useCallback, useEffect } from "react";

import {
	dismissNotification,
	listNotifications,
	markAllRead as markAllReadApi,
	markRead as markReadApi,
} from "../services/notificationsService";
import { useNotificationsStore } from "../store/notificationsStore";

/**
 * Bootstraps the notifications list once per session and exposes
 * idempotent mark/dismiss callbacks that keep the service + store in sync.
 *
 * Mounted once at app shell level (AppLayout) so the bell + page share the
 * same data and no double-fetch occurs.
 */
export function useNotifications() {
	const hasHydrated = useNotificationsStore((s) => s.hasHydrated);
	const setNotifications = useNotificationsStore((s) => s.setNotifications);
	const setLoading = useNotificationsStore((s) => s.setLoading);
	const patch = useNotificationsStore((s) => s.patchNotification);
	const remove = useNotificationsStore((s) => s.removeNotification);
	const markAllInStore = useNotificationsStore((s) => s.markAll);

	useEffect(() => {
		if (hasHydrated) return;
		let cancelled = false;
		setLoading(true);
		listNotifications()
			.then((items) => {
				if (cancelled) return;
				setNotifications(items);
			})
			.finally(() => {
				if (cancelled) return;
				setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [hasHydrated, setNotifications, setLoading]);

	const markRead = useCallback(
		async (id: string) => {
			patch(id, { read: true });
			await markReadApi(id);
		},
		[patch],
	);

	const markAllRead = useCallback(async () => {
		markAllInStore();
		await markAllReadApi();
	}, [markAllInStore]);

	const dismiss = useCallback(
		async (id: string) => {
			remove(id);
			await dismissNotification(id);
		},
		[remove],
	);

	return { markRead, markAllRead, dismiss };
}
