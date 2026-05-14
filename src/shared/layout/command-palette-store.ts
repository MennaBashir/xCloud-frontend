import { create } from "zustand";

type CommandPaletteState = {
	open: () => void;
	close: () => void;
	toggle: () => void;
	isOpen: boolean;
};

export const useCommandPalette = create<CommandPaletteState>((set) => ({
	isOpen: false,
	open: () => set({ isOpen: true }),
	close: () => set({ isOpen: false }),
	toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));
