import { create } from "zustand";

/**
 * Cross-feature handoff to the Chat AI tab.
 *
 * Other features (e.g. the email inbox "Summarize" action) drop a prompt here
 * and navigate to `/app/chat`. The ChatPage consumes the pending prompt on
 * mount, opens a fresh conversation, and auto-sends it.
 */
export type ChatHandoff = {
	/** The full message to send to the assistant. */
	prompt: string;
	/** Short title for the new conversation (optional). */
	title?: string;
	/** Force a brand-new conversation instead of the active one. */
	newConversation?: boolean;
};

type ChatHandoffState = {
	pending: ChatHandoff | null;
	setPending: (handoff: ChatHandoff) => void;
	consumePending: () => ChatHandoff | null;
};

export const useChatHandoffStore = create<ChatHandoffState>((set, get) => ({
	pending: null,
	setPending: (handoff) => set({ pending: handoff }),
	consumePending: () => {
		const { pending } = get();
		if (pending) set({ pending: null });
		return pending;
	},
}));
