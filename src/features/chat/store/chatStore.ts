import { create } from "zustand";

import type {
	ChatMessage,
	Citation,
	Conversation,
} from "../types/chat";

/** Derive a short conversation title from the first user message. */
export function inferConversationTitle(firstMessage: string): string {
	const trimmed = firstMessage.trim();
	if (trimmed.length < 4) return "New chat";
	if (trimmed.length <= 48) return trimmed;
	return `${trimmed.slice(0, 48)}…`;
}

type ChatState = {
	conversations: Conversation[];
	messages: Record<string, ChatMessage[]>;
	activeConversationId: string | null;
	streamingMessageId: string | null;
	modelId: string;
	/** Used to abort an in-flight stream. */
	abortController: AbortController | null;
};

type ChatActions = {
	createConversation: () => string;
	selectConversation: (id: string) => void;
	deleteConversation: (id: string) => void;
	renameConversation: (id: string, title: string) => void;
	clearConversations: () => void;

	/** Replace the full conversation list (from backend `GET /llm/chats`). */
	hydrateConversations: (conversations: Conversation[]) => void;
	/** Replace the message list of a conversation (from `GET /llm/chats/{id}`). */
	hydrateMessages: (conversationId: string, messages: ChatMessage[]) => void;
	/** Swap a local conversation id for the backend-assigned chat id. */
	reconcileConversationId: (localId: string, backendId: string) => void;

	appendMessage: (message: ChatMessage) => void;
	updateMessage: (
		messageId: string,
		updater: (m: ChatMessage) => ChatMessage,
	) => void;
	setStreamingMessage: (messageId: string | null) => void;
	setAbortController: (controller: AbortController | null) => void;

	setModelId: (id: string) => void;
};

export type ChatStore = ChatState & ChatActions;

function genId(prefix: string) {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now()
		.toString(36)
		.slice(-4)}`;
}

export const useChatStore = create<ChatStore>((set) => ({
	conversations: [],
	messages: {},
	activeConversationId: null,
	streamingMessageId: null,
	modelId: "",
	abortController: null,

	createConversation: () => {
		const id = genId("conv");
		const now = new Date().toISOString();
		const conv: Conversation = {
			id,
			title: "New chat",
			createdAt: now,
			updatedAt: now,
			preview: "",
		};
		set((s) => ({
			conversations: [conv, ...s.conversations],
			messages: { ...s.messages, [id]: [] },
			activeConversationId: id,
		}));
		return id;
	},

	selectConversation: (id) => set({ activeConversationId: id }),

	renameConversation: (id, title) =>
		set((s) => ({
			conversations: s.conversations.map((c) =>
				c.id === id ? { ...c, title } : c,
			),
		})),

	hydrateConversations: (conversations) =>
		set((s) => ({
			conversations,
			// Keep any locally-cached messages we already loaded.
			messages: s.messages,
		})),

	hydrateMessages: (conversationId, messages) =>
		set((s) => ({
			messages: { ...s.messages, [conversationId]: messages },
		})),

	reconcileConversationId: (localId, backendId) =>
		set((s) => {
			if (localId === backendId) return s;
			const { [localId]: localMsgs, ...restMsgs } = s.messages;
			const remapped = (localMsgs ?? []).map((m) => ({
				...m,
				conversationId: backendId,
			}));
			return {
				conversations: s.conversations.map((c) =>
					c.id === localId ? { ...c, id: backendId } : c,
				),
				messages: { ...restMsgs, [backendId]: remapped },
				activeConversationId:
					s.activeConversationId === localId
						? backendId
						: s.activeConversationId,
				streamingMessageId: s.streamingMessageId,
			};
		}),

	deleteConversation: (id) =>
		set((s) => {
			const { [id]: _removed, ...rest } = s.messages;
			void _removed;
			const conversations = s.conversations.filter((c) => c.id !== id);
			const nextActive =
				s.activeConversationId === id
					? (conversations[0]?.id ?? null)
					: s.activeConversationId;
			return {
				messages: rest,
				conversations,
				activeConversationId: nextActive,
			};
		}),

	clearConversations: () =>
		set({
			conversations: [],
			messages: {},
			activeConversationId: null,
			streamingMessageId: null,
		}),

	appendMessage: (message) =>
		set((s) => {
			const list = s.messages[message.conversationId] ?? [];
			const updatedList = [...list, message];

			// Update conversation preview + updatedAt + title when applicable
			const conv = s.conversations.find((c) => c.id === message.conversationId);
			let conversations = s.conversations;
			if (conv) {
				const next: Conversation = {
					...conv,
					updatedAt: message.createdAt,
					preview:
						message.role === "user"
							? message.content
							: conv.preview || message.content.slice(0, 80),
					title:
						conv.title === "New chat" && message.role === "user"
							? inferConversationTitle(message.content)
							: conv.title,
				};
				conversations = [
					next,
					...s.conversations.filter((c) => c.id !== message.conversationId),
				];
			}

			return {
				messages: { ...s.messages, [message.conversationId]: updatedList },
				conversations,
			};
		}),

	updateMessage: (messageId, updater) =>
		set((s) => {
			const conversationId = s.activeConversationId;
			if (!conversationId) return s;
			const list = s.messages[conversationId] ?? [];
			const next = list.map((m) => (m.id === messageId ? updater(m) : m));
			return {
				messages: { ...s.messages, [conversationId]: next },
			};
		}),

	setStreamingMessage: (id) => set({ streamingMessageId: id }),
	setAbortController: (controller) => set({ abortController: controller }),

	setModelId: (id) => set({ modelId: id }),
}));

/**
 * Selector helpers.
 *
 * IMPORTANT — these must return stable references to avoid
 * `useSyncExternalStore` re-render loops. Never `return []` or `return {}`
 * from a selector; always use a module-level frozen constant.
 */
const EMPTY_MESSAGES: readonly ChatMessage[] = Object.freeze([]);

export const selectActiveConversation = (s: ChatStore): Conversation | null => {
	const id = s.activeConversationId;
	if (!id) return null;
	return s.conversations.find((c) => c.id === id) ?? null;
};

export const selectActiveMessages = (s: ChatStore): readonly ChatMessage[] => {
	const id = s.activeConversationId;
	if (!id) return EMPTY_MESSAGES;
	return s.messages[id] ?? EMPTY_MESSAGES;
};

export const selectIsStreaming = (s: ChatStore): boolean =>
	s.streamingMessageId !== null;

/** Helpers */
export function makeUserMessage(
	conversationId: string,
	content: string,
): ChatMessage {
	return {
		id: genId("msg"),
		conversationId,
		role: "user",
		content,
		createdAt: new Date().toISOString(),
		status: "complete",
	};
}

export function makeAssistantStub(conversationId: string): ChatMessage {
	return {
		id: genId("msg"),
		conversationId,
		role: "assistant",
		content: "",
		createdAt: new Date().toISOString(),
		status: "streaming",
	};
}

export function attachCitations(
	message: ChatMessage,
	citations: Citation[],
): ChatMessage {
	return { ...message, citations };
}
