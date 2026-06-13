import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { ragGet, ragPost, ragDelete, ApiError } from "@/shared/api";

import type { RagCollection, RagStatus } from "../types/rag";

export type CollectionFilesState = {
	files: ragGet.RagFile[];
	isLoading: boolean;
	error: string | null;
};

function toStatus(raw: ragGet.RagStatus): RagStatus {
	const isLoaded =
		!!raw.collection_name ||
		(raw.status?.toLowerCase().includes("loaded") ?? false);
	return {
		isLoaded,
		collectionName: raw.collection_name ?? null,
		raw: raw.status,
	};
}

function errorMessage(err: unknown, fallback: string): string {
	if (err instanceof ApiError) return err.message;
	if (err instanceof Error) return err.message;
	return fallback;
}

/**
 * Loads and manages RAG collections from the backend.
 *
 * Exposes the current status, the collection list, and actions to index a
 * server-side folder or load an existing collection. Status + list are
 * refreshed after every mutation.
 */
export function useRagManager() {
	const { t } = useTranslation("rag");

	const [status, setStatus] = useState<RagStatus | null>(null);
	const [collections, setCollections] = useState<RagCollection[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isIndexing, setIsIndexing] = useState(false);
	const [progress, setProgress] = useState<{
		phase: ragPost.IndexJobPhase;
		done: number;
		total: number;
	} | null>(null);
	const [loadingName, setLoadingName] = useState<string | null>(null);
	const [deletingName, setDeletingName] = useState<string | null>(null);
	const [updatingName, setUpdatingName] = useState<string | null>(null);
	const [filesByCollection, setFilesByCollection] = useState<
		Record<string, CollectionFilesState>
	>({});
	const [error, setError] = useState<string | null>(null);
	const pollingRef = useRef(false);

	useEffect(() => {
		return () => {
			pollingRef.current = false;
		};
	}, []);

	const refresh = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const [rawStatus, list] = await Promise.all([
				ragGet.getRagStatus(),
				ragGet.listRagCollections(),
			]);
			setStatus(toStatus(rawStatus));
			setCollections(list);
		} catch (err) {
			setError(errorMessage(err, t("errors.load")));
		} finally {
			setIsLoading(false);
		}
	}, [t]);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	const indexFolder = useCallback(
		async (folderPath: string, collectionName: string) => {
			setIsIndexing(true);
			setProgress(null);
			try {
				// Kick off the background job on the server.
				await ragPost.indexFolder({ folderPath, collectionName });
			} catch (err) {
				setIsIndexing(false);
				toast.error(errorMessage(err, t("errors.index")));
				return false;
			}

			// Poll the job until it reaches a terminal state.
			pollingRef.current = true;
			const delay = (ms: number) =>
				new Promise((r) => setTimeout(r, ms));

			try {
				for (;;) {
					if (!pollingRef.current) return false;
					let job: ragPost.IndexJobStatus;
					try {
						job = await ragPost.getIndexStatus();
					} catch {
						await delay(1200);
						continue;
					}

					setProgress({
						phase: job.phase ?? "starting",
						done: job.done ?? 0,
						total: job.total ?? 0,
					});

					if (job.state === "success") {
						toast.success(
							t("toast.indexed", {
								count: job.result?.documents_indexed ?? 0,
								collection:
									job.result?.collection ?? collectionName,
							}),
						);
						await refresh();
						return true;
					}
					if (job.state === "cancelled") {
						toast(t("toast.indexCancelled"));
						return false;
					}
					if (job.state === "error" || job.state === "idle") {
						toast.error(
							errorMessage(
								job.error ?? null,
								t("errors.index"),
							),
						);
						return false;
					}

					await delay(1200);
				}
			} finally {
				pollingRef.current = false;
				setIsIndexing(false);
				setProgress(null);
			}
		},
		[refresh, t],
	);

	const cancelIndex = useCallback(async () => {
		try {
			await ragPost.cancelIndexJob();
		} catch {
			/* best-effort; the poll loop will reflect the final state */
		}
	}, []);

	const loadCollection = useCallback(
		async (name: string) => {
			setLoadingName(name);
			try {
				await ragPost.loadCollection(name);
				toast.success(t("toast.loaded", { collection: name }));
				await refresh();
				return true;
			} catch (err) {
				toast.error(errorMessage(err, t("errors.loadCollection")));
				return false;
			} finally {
				setLoadingName(null);
			}
		},
		[refresh, t],
	);

	const deleteCollection = useCallback(
		async (name: string) => {
			setDeletingName(name);
			try {
				await ragDelete.deleteCollection(name);
				toast.success(t("toast.deleted", { collection: name }));
				setFilesByCollection((prev) => {
					const next = { ...prev };
					delete next[name];
					return next;
				});
				await refresh();
				return true;
			} catch (err) {
				toast.error(errorMessage(err, t("errors.delete")));
				return false;
			} finally {
				setDeletingName(null);
			}
		},
		[refresh, t],
	);

	const openCollectionFiles = useCallback(
		async (name: string) => {
			// Serve from cache if already fetched successfully.
			const cached = filesByCollection[name];
			if (cached && !cached.error && !cached.isLoading) return;

			setFilesByCollection((prev) => ({
				...prev,
				[name]: { files: [], isLoading: true, error: null },
			}));
			try {
				const res = await ragGet.getCollectionFiles(name);
				setFilesByCollection((prev) => ({
					...prev,
					[name]: {
						files: res.files,
						isLoading: false,
						error: null,
					},
				}));
			} catch (err) {
				setFilesByCollection((prev) => ({
					...prev,
					[name]: {
						files: [],
						isLoading: false,
						error: errorMessage(err, t("errors.files")),
					},
				}));
			}
		},
		[filesByCollection, t],
	);

	const updateCollection = useCallback(
		async (name: string) => {
			setUpdatingName(name);
			try {
				const src = await ragGet.getCollectionSource(name);
				if (!src.folder_path) {
					toast.error(t("errors.noSource"));
					return false;
				}
				// Re-index the same folder into the same collection (the
				// indexer replaces the existing collection). Reuses the
				// cancellable job + progress UI.
				const ok = await indexFolder(src.folder_path, name);
				if (ok) {
					setFilesByCollection((prev) => {
						const next = { ...prev };
						delete next[name];
						return next;
					});
				}
				return ok;
			} catch (err) {
				toast.error(errorMessage(err, t("errors.update")));
				return false;
			} finally {
				setUpdatingName(null);
			}
		},
		[indexFolder, t],
	);

	return {
		status,
		collections,
		isLoading,
		isIndexing,
		progress,
		loadingName,
		deletingName,
		updatingName,
		filesByCollection,
		error,
		refresh,
		indexFolder,
		cancelIndex,
		loadCollection,
		deleteCollection,
		updateCollection,
		openCollectionFiles,
	};
}
