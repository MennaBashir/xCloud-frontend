/**
 * Files GET endpoints.
 * Mirrors `xcloud/src/presentation/files_api.py`.
 */
import { request } from "../client";

export type BrowseEntry = {
	name: string;
	is_directory: boolean;
	size: number | null;
	modified: string;
	permissions: string;
	mime_type?: string | null;
};

export type BrowseResult = {
	path: string;
	parent: string;
	entries: BrowseEntry[];
	total_dirs: number;
	total_files: number;
};

export type FileView = {
	path: string;
	name: string;
	size: number;
	mime_type: string | null;
	modified: string;
	is_text: boolean;
	content: string;
	encoding?: "base64";
};

export function browseDirectory(
	path: string,
	showHidden = false,
): Promise<BrowseResult> {
	return request<BrowseResult>("GET", "/files/browse", {
		query: { path, show_hidden: showHidden },
	});
}

export function viewFile(path: string): Promise<FileView> {
	return request<FileView>("GET", "/files/view", {
		query: { path },
	});
}
