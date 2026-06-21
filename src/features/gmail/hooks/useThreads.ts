import { useCallback, useEffect, useState } from "react";

import {
	getFolderCounts,
	listThreads,
} from "../services/gmailService";
import { useGmailStore } from "../store/gmailStore";
import type { Folder, Thread } from "../types/mail";

type UseThreadsResult = {
	threads: Thread[];
	counts: Record<Folder, number>;
	loading: boolean;
	refresh: () => void;
};

export function useThreads(): UseThreadsResult {
	const folder = useGmailStore((s) => s.folder);
	const query = useGmailStore((s) => s.query);
	const labelId = useGmailStore((s) => s.labelId);

	const [threads, setThreads] = useState<Thread[]>([]);
	const [counts, setCounts] = useState<Record<Folder, number>>({
		inbox: 0,
		starred: 0,
		sent: 0,
		drafts: 0,
		archive: 0,
		trash: 0,
	});
	const [loading, setLoading] = useState(true);
	const [tick, setTick] = useState(0);

	const refresh = useCallback(() => setTick((t) => t + 1), []);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		Promise.all([
			listThreads({ folder, query, labelId }),
			getFolderCounts(),
		])
			.then(([t, c]) => {
				if (cancelled) return;
				setThreads(t);
				setCounts(c);
			})
			.finally(() => {
				if (cancelled) return;
				setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [folder, query, labelId, tick]);

	return { threads, counts, loading, refresh };
}
