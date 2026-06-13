import { useEffect, useState } from "react";

import { ragGet } from "@/shared/api";

/**
 * Reports whether a RAG collection is currently loaded on the backend.
 * The chat UI uses this to conditionally show the "Use documents" toggle.
 */
export function useRag() {
	const [available, setAvailable] = useState(false);
	const [collectionName, setCollectionName] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const status = await ragGet.getRagStatus();
				if (cancelled) return;
				const loaded =
					!!status.collection_name ||
					(status.status?.toLowerCase().includes("loaded") ?? false);
				setAvailable(loaded);
				setCollectionName(status.collection_name ?? null);
			} catch {
				if (!cancelled) setAvailable(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	return { available, collectionName };
}
