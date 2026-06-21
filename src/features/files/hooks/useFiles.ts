import { useCallback, useEffect, useState } from "react";

import { listFiles } from "../services/filesService";
import { useFilesStore } from "../store/filesStore";
import type { FileItem, FileKind } from "../types/file";

type UseFilesResult = {
	items: FileItem[];
	availableKinds: FileKind[];
	loading: boolean;
	error: string | null;
	refresh: () => void;
};

/**
 * Fetches files from the mock service based on the current store filter.
 * Re-fetches whenever any filter input changes.
 */
export function useFiles(): UseFilesResult {
	const category = useFilesStore((s) => s.category);
	const query = useFilesStore((s) => s.query);
	const kinds = useFilesStore((s) => s.kinds);
	const sortField = useFilesStore((s) => s.sortField);
	const sortDirection = useFilesStore((s) => s.sortDirection);

	const [items, setItems] = useState<FileItem[]>([]);
	const [availableKinds, setAvailableKinds] = useState<FileKind[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [reloadTick, setReloadTick] = useState(0);

	const refresh = useCallback(() => setReloadTick((t) => t + 1), []);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);
		listFiles({
			category,
			query,
			kinds,
			sortField,
			sortDirection,
		})
			.then((next) => {
				if (cancelled) return;
				setItems(next.items);
				setAvailableKinds(next.availableKinds);
			})
			.catch((err: unknown) => {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : "Failed to load files");
			})
			.finally(() => {
				if (cancelled) return;
				setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [category, query, kinds, sortField, sortDirection, reloadTick]);

	return { items, availableKinds, loading, error, refresh };
}
