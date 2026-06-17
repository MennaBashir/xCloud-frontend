import { create } from "zustand";

import type {
	FileCategory,
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
};

type FilesActions = {
	setCategory: (category: FileCategory) => void;
	setQuery: (query: string) => void;
	toggleKind: (kind: FileKind) => void;
	clearKinds: () => void;
	setSort: (field: SortField, direction?: SortDirection) => void;
	setViewMode: (mode: ViewMode) => void;
};

export const useFilesStore = create<FilesState & FilesActions>((set) => ({
	category: "all",
	query: "",
	kinds: [],
	sortField: "updatedAt",
	sortDirection: "desc",
	viewMode: "list",

	// Switching tabs clears stale kind filters so results never vanish
	// because of a filter that doesn't apply to the new directory.
	setCategory: (category) => set({ category, kinds: [] }),
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
}));
