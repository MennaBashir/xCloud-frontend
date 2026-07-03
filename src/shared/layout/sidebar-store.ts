import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* ──────────────────────────────────────────────────────────────────────────
 * Sidebar store — controls whether the desktop app rail is collapsed to an
 * icon-only strip or fully expanded. Persisted to localStorage so the user's
 * preference survives reloads.
 * ──────────────────────────────────────────────────────────────────────── */

type SidebarState = {
	collapsed: boolean;
	setCollapsed: (value: boolean) => void;
	toggle: () => void;
};

export const useSidebar = create<SidebarState>()(
	persist(
		(set) => ({
			collapsed: false,
			setCollapsed: (value) => set({ collapsed: value }),
			toggle: () => set((s) => ({ collapsed: !s.collapsed })),
		}),
		{
			name: "sprintifai:sidebar",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
