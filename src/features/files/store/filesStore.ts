import { create } from "zustand";

import type {
	FileCategory,
	FileItem,
	FileKind,
	SortDirection,
	SortField,
	ViewMode,
} from "../types/file";

type FilesState = {
	category: FileCategory;
	query: string;
	kinds: FileKind[];
	sortField: SortField;
	sortDirection: SortDirection;
	viewMode: ViewMode;
	previewFile: FileItem | null;
	uploadDialogOpen: boolean;
};

type FilesActions = {
	setCategory: (category: FileCategory) => void;
	setQuery: (query: string) => void;
	toggleKind: (kind: FileKind) => void;
	clearKinds: () => void;
	setSort: (field: SortField, direction?: SortDirection) => void;
	setViewMode: (mode: ViewMode) => void;
	openPreview: (file: FileItem) => void;
	closePreview: () => void;
	openUpload: () => void;
	closeUpload: () => void;
};

export const useFilesStore = create<FilesState & FilesActions>((set) => ({
	category: "recent",
	query: "",
	kinds: [],
	sortField: "updatedAt",
	sortDirection: "desc",
	viewMode: "list",
	previewFile: null,
	uploadDialogOpen: false,

	setCategory: (category) => set({ category }),
	setQuery: (query) => set({ query }),
	toggleKind: (kind) =>
		set((s) => ({
			kinds: s.kinds.includes(kind)
				? s.kinds.filter((k) => k !== kind)
				: [...s.kinds, kind],
		})),
	clearKinds: () => set({ kinds: [] }),
	setSort: (field, direction) =>
		set((s) => ({
			sortField: field,
			sortDirection:
				direction ??
				(s.sortField === field
					? s.sortDirection === "asc"
						? "desc"
						: "asc"
					: "desc"),
		})),
	setViewMode: (viewMode) => set({ viewMode }),
	openPreview: (previewFile) => set({ previewFile }),
	closePreview: () => set({ previewFile: null }),
	openUpload: () => set({ uploadDialogOpen: true }),
	closeUpload: () => set({ uploadDialogOpen: false }),
}));
