import { useEffect, useState } from "react";

import { getThread } from "../mock/mockGmailService";
import type { Thread } from "../types/mail";

export function useThread(threadId: string | null): {
	thread: Thread | null;
	loading: boolean;
	reload: () => void;
} {
	const [thread, setThread] = useState<Thread | null>(null);
	const [loading, setLoading] = useState(false);
	const [tick, setTick] = useState(0);

	useEffect(() => {
		if (!threadId) {
			setThread(null);
			return;
		}
		let cancelled = false;
		setLoading(true);
		getThread(threadId)
			.then((t) => {
				if (cancelled) return;
				setThread(t);
			})
			.finally(() => {
				if (cancelled) return;
				setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [threadId, tick]);

	return { thread, loading, reload: () => setTick((t) => t + 1) };
}
