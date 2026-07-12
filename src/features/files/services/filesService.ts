/**
 * Files service — talks to the xcloud backend `/files` endpoints.
 *
 * Each category maps to one fixed directory on the user's device. Paths use
 * `~` and are expanded server-side via `os.path.expanduser`.
 *
 * Single point of contact for the Files feature: list a directory, view a
 * file's content.
 */
import { filesGet } from "@/shared/api";

import type {
	FileCategory,
	FileItem,
	FileKind,
	FilesFilter,
} from "../types/file";

/**
 * Concrete directories that hold real files. The `all` tab is a virtual
 * category that merges every directory below.
 */
const DIR_TRANSCRIPTIONS = "~/Xcloud/transcriptions";
const DIR_SUMMARIZATION = "~/Xcloud/summarization";
const DIR_RECORDINGS = "~/Xcloud/recordings";
const DIR_NOTES = "~/Xcloud/notes"; 

/** Maps each non-virtual category to its single backing directory. */
const CATEGORY_DIR: Record<
	Exclude<FileCategory, "all">,
	string
> = {
	transcriptions: DIR_TRANSCRIPTIONS,
	summarized: DIR_SUMMARIZATION,
	recordings: DIR_RECORDINGS,
	notes: DIR_NOTES,
};

/**
 * Directories the `all` tab merges, paired with the category used for
 * per-entry kind inference (so recordings still resolve to "recording").
 */
const ALL_SOURCES: Array<{
	dir: string;
	category: Exclude<FileCategory, "all">;
}> = [
	{ dir: DIR_TRANSCRIPTIONS, category: "transcriptions" },
	{ dir: DIR_SUMMARIZATION, category: "summarized" },
	{ dir: DIR_RECORDINGS, category: "recordings" },
	{ dir: DIR_NOTES, category: "notes" },
];

/** Backwards-compatible lookup of a category's primary directory. */
export const CATEGORY_DIRS: Record<FileCategory, string> = {
	all: DIR_TRANSCRIPTIONS,
	...CATEGORY_DIR,
};

/** Infer a UI kind from a filename extension. */
export function inferKindFromName(name: string): FileKind {
	const ext = name.split(".").pop()?.toLowerCase() ?? "";
	if (["pdf"].includes(ext)) return "pdf";
	if (["doc", "docx", "rtf"].includes(ext)) return "doc";
	if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(ext))
		return "image";
	if (["mp4", "mov", "webm", "mkv", "avi"].includes(ext)) return "video";
	if (["mp3", "wav", "m4a", "ogg", "flac", "opus"].includes(ext))
		return "audio";
	if (["txt", "vtt", "srt"].includes(ext)) return "transcript";
	if (["md"].includes(ext)) return "note";
	if (["ppt", "pptx", "key"].includes(ext)) return "deck";
	if (["json"].includes(ext)) return "doc";
	return "other";
}

/** Map a kind using the category context (recordings dir favours media). */
function kindForEntry(
	name: string,
	mime: string | null | undefined,
	category: FileCategory,
): FileKind {
	const inferred = inferKindFromName(name);
	if (category === "recordings") {
		if (inferred === "audio" || inferred === "video") return "recording";
	}
	if (inferred === "other" && mime) {
		if (mime.startsWith("image/")) return "image";
		if (mime.startsWith("video/")) return "video";
		if (mime.startsWith("audio/")) return "audio";
		if (mime.startsWith("text/")) return "transcript";
	}
	return inferred;
}

function stripTrailingSlash(name: string): string {
	return name.endsWith("/") ? name.slice(0, -1) : name;
}

function joinPath(dir: string, name: string): string {
	const base = dir.endsWith("/") ? dir.slice(0, -1) : dir;
	return `${base}/${name}`;
}

function applyFilter(items: FileItem[], filter: FilesFilter): FileItem[] {
	let out = items.slice();

	// Kind filter (multi-select)
	if (filter.kinds.length > 0) {
		const kindSet = new Set(filter.kinds);
		out = out.filter((f) => kindSet.has(f.kind));
	}

	// Text search across name + kind
	const q = filter.query.trim().toLowerCase();
	if (q.length > 0) {
		out = out.filter((f) =>
			[f.name, f.kind].join(" ").toLowerCase().includes(q),
		);
	}

	// Sort
	out.sort((a, b) => {
		const dir = filter.sortDirection === "asc" ? 1 : -1;
		switch (filter.sortField) {
			case "name":
				return a.name.localeCompare(b.name) * dir;
			case "size":
				return (a.sizeBytes - b.sizeBytes) * dir;
			case "updatedAt":
			default:
				return (
					(a.updatedAt < b.updatedAt
						? -1
						: a.updatedAt > b.updatedAt
							? 1
							: 0) * dir
				);
		}
	});

	return out;
}

export type ListFilesResult = {
	items: FileItem[];
	/** Distinct kinds present in the directory (before kind filtering). */
	availableKinds: FileKind[];
};

/**
 * Browse a single directory and map its files into `FileItem`s. A missing
 * directory (e.g. the user hasn't created any notes yet) resolves to an empty
 * list rather than throwing, so the `all` merge stays resilient.
 */
async function listDirectory(
	dir: string,
	category: Exclude<FileCategory, "all">,
): Promise<FileItem[]> {
	let result: filesGet.BrowseResult;
	try {
		result = await filesGet.browseDirectory(dir);
	} catch {
		return [];
	}

	return result.entries
		.filter((e) => !e.is_directory)
		.map((e) => {
			const name = stripTrailingSlash(e.name);
			const path = joinPath(result.path, name);
			return {
				id: path,
				path,
				name,
				kind: kindForEntry(name, e.mime_type, category),
				mimeType: e.mime_type ?? null,
				sizeBytes: e.size ?? 0,
				createdAt: e.modified,
				updatedAt: e.modified,
			};
		});
}

export async function listFiles(
	filter: FilesFilter,
): Promise<ListFilesResult> {
	let items: FileItem[];

	if (filter.category === "all") {
		const groups = await Promise.all(
			ALL_SOURCES.map((src) => listDirectory(src.dir, src.category)),
		);
		// Deduplicate by absolute path in case directories overlap.
		const byPath = new Map<string, FileItem>();
		for (const group of groups) {
			for (const item of group) byPath.set(item.path, item);
		}
		items = Array.from(byPath.values());
	} else {
		items = await listDirectory(CATEGORY_DIR[filter.category], filter.category);
	}

	const availableKinds = Array.from(new Set(items.map((f) => f.kind)));

	return { items: applyFilter(items, filter), availableKinds };
}

export type FileContent = filesGet.FileView;

export async function viewFile(path: string): Promise<FileContent> {
	return filesGet.viewFile(path);
}
