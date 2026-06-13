import { useCallback, useEffect, useState } from "react";

import { llmGet, llmDelete, llmPut } from "@/shared/api";
import { useAuthStore } from "@/features/auth/store/authStore";

import { useChatStore } from "../store/chatStore";
import {
	apiChatToConversation,
	apiMessageToChatMessage,
} from "../lib/adapters";

/**
 * Loads and manages the user's chat history from the backend.
 *
 * Exposes selecting (with message hydration), creating a fresh local chat,
 * deleting, renaming, and searching.
 */
export function useConversations() {
	const hydrateConversations = useChatStore((s) => s.hydrateConversations);
	const hydrateMessages = useChatStore((s) => s.hydrateMessages);
	const selectConversation = useChatStore((s) => s.selectConversation);
	const createConversation = useChatStore((s) => s.createConversation);
	const deleteLocal = useChatStore((s) => s.deleteConversation);
	const renameLocal = useChatStore((s) => s.renameConversation);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const getToken = () => useAuthStore.getState().token;

	const refresh = useCallback(async () => {
		const token = getToken();
		if (!token) return;
		setIsLoading(true);
		setError(null);
		try {
			const chats = await llmGet.listChats(token);
			hydrateConversations(chats.map(apiChatToConversation));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load chats.");
		} finally {
			setIsLoading(false);
		}
	}, [hydrateConversations]);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	const select = useCallback(
		async (id: string) => {
			selectConversation(id);
			const token = getToken();
			if (!token) return;
			// Hydrate messages if we don't have them yet (or always re-fetch).
			const existing = useChatStore.getState().messages[id];
			if (existing && existing.length > 0) return;
			try {
				const detail = await llmGet.getChat(token, id);
				hydrateMessages(
					id,
					detail.messages.map((m) => apiMessageToChatMessage(id, m)),
				);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load chat.",
				);
			}
		},
		[selectConversation, hydrateMessages],
	);

	const startNew = useCallback(() => {
		// Local-only until the first message is sent (backend creates the row).
		return createConversation();
	}, [createConversation]);

	const remove = useCallback(
		async (id: string) => {
			deleteLocal(id);
			const token = getToken();
			if (!token) return;
			try {
				await llmDelete.deleteChat(token, id);
			} catch {
				// Local row already removed; backend may not have it yet
				// (e.g. brand-new local conversation). Ignore.
			}
		},
		[deleteLocal],
	);

	const rename = useCallback(
		async (id: string, title: string) => {
			renameLocal(id, title);
			const token = getToken();
			if (!token) return;
			try {
				await llmPut.renameChat(token, id, title);
			} catch {
				/* keep optimistic local rename */
			}
		},
		[renameLocal],
	);

	const search = useCallback(async (q: string) => {
		const token = getToken();
		if (!token) return [];
		try {
			const results = await llmGet.searchChats(token, q);
			return results.map((r) => ({
				...apiChatToConversation(r),
				preview: r.matching_messages[0]?.content ?? "",
			}));
		} catch {
			return [];
		}
	}, []);

	return {
		isLoading,
		error,
		refresh,
		select,
		startNew,
		remove,
		rename,
		search,
	};
}
