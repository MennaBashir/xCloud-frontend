import { create } from "zustand";

import type { Folder } from "../types/mail";

type GmailState = {
	folder: Folder;
	query: string;
	labelId: string | undefined;
	selectedThreadId: string | null;
	composeOpen: boolean;
};

type GmailActions = {
	setFolder: (folder: Folder) => void;
	setQuery: (query: string) => void;
	setLabelId: (id: string | undefined) => void;
	selectThread: (id: string | null) => void;
	openCompose: () => void;
	closeCompose: () => void;
};

export const useGmailStore = create<GmailState & GmailActions>((set) => ({
	folder: "inbox",
	query: "",
	labelId: undefined,
	selectedThreadId: null,
	composeOpen: false,

	setFolder: (folder) => set({ folder, selectedThreadId: null }),
	setQuery: (query) => set({ query }),
	setLabelId: (labelId) => set({ labelId, selectedThreadId: null }),
	selectThread: (id) => set({ selectedThreadId: id }),
	openCompose: () => set({ composeOpen: true }),
	closeCompose: () => set({ composeOpen: false }),
}));
