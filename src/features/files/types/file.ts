/**
 * File feature types.
 *
 * `FileItem` is the canonical shape. The name avoids colliding with the
 * global `File` (Web File API) used during uploads.
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

export type FileCategory =
	| "recent"
	| "all"
	| "recordings"
	| "tasks"
	| "notes";

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

export type FileOwner = {
	id: string;
	name: string;
	email: string;
	avatarUrl?: string;
};

export type FileItem = {
	id: string;
	name: string;
	kind: FileKind;
	/** Size in bytes. UI formats this with `formatBytes()`. */
	sizeBytes: number;
	/** ISO 8601. */
	createdAt: string;
	updatedAt: string;
	owner: FileOwner;
	/** Tag chips shown on cards (project, meeting reference, etc.). */
	tags: string[];
	/** Optional preview / download URL. */
	url?: string;
	/** True if file came from a meeting (recording, transcript). */
	fromMeeting?: boolean;
	/** Optional source meeting title. */
	meetingTitle?: string;
};
