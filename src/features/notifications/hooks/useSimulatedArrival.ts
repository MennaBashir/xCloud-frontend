import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { pushNotification } from "../mock/mockNotificationsService";
import { useNotificationsStore } from "../store/notificationsStore";

/**
 * Fires exactly once per session, ~20s after mount, to demonstrate the
 * live notification pipeline. Module-level flag ensures the timeout runs
 * only once across re-mounts.
 */
let fired = false;

export function useSimulatedArrival() {
	const { t } = useTranslation("notifications");
	const prepend = useNotificationsStore((s) => s.prependNotification);
	const hasHydrated = useNotificationsStore((s) => s.hasHydrated);
	const timerRef = useRef<number | null>(null);

	useEffect(() => {
		if (fired || !hasHydrated) return;

		timerRef.current = window.setTimeout(() => {
			if (fired) return;
			fired = true;

			const created = pushNotification({
				kind: "meeting",
				title: t("arrival.title"),
				body: t("arrival.body"),
				actor: {
					id: "system",
					name: "SprintifAI",
				},
				relatedTo: {
					kind: "meeting",
					id: "m_001",
					label: "Sprint planning",
				},
				ctaLabel: t("arrival.cta"),
				ctaHref: "/app/meeting",
			});

			prepend(created);
			toast(t("arrival.toast"), {
				description: t("arrival.body"),
			});
		}, 20_000);

		return () => {
			if (timerRef.current !== null) {
				window.clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [hasHydrated, prepend, t]);
}
