/**
 * File feature types.
 *
 * `FileItem` is the canonical shape. The name avoids colliding with the
 * global `File` (Web File API). Items map 1:1 onto entries returned by the
 * backend `/files/browse` endpoint.
 */

export type FileKind =
	| "pdf"
	| "doc"
	| "image"
	| "video"
	| "audio"
	| "recording"
	| "transcript"
	| "deck"
	| "note"
	| "task"
	| "other";

/**
 * Each category maps to one fixed backend directory:
 *   all         → ~/Xcloud/transcriptions
 *   summarized  → ~/Xcloud/summarization
 *   recordings  → ~/Xcloud/recordings
 */
export type FileCategory = "all" | "summarized" | "recordings";

export type ViewMode = "list" | "grid";

export type SortField = "updatedAt" | "name" | "size";
export type SortDirection = "asc" | "desc";

export type FilesFilter = {
	category: FileCategory;
	query: string;
	kinds: FileKind[];
	sortField: SortField;
	sortDirection: SortDirection;
};

export type FileItem = {
	/** Absolute server path — the key used by view/download endpoints. */
	id: string;
	path: string;
	name: string;
	kind: FileKind;
	/** MIME type as reported by the backend (may be null/unknown). */
	mimeType: string | null;
	/** Size in bytes. UI formats this with `formatBytes()`. */
	sizeBytes: number;
	/** ISO 8601 — derived from the file's modification time. */
	createdAt: string;
	updatedAt: string;
};
