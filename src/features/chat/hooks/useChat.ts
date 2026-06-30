import { useCallback } from "react";

import { llmGet, llmPost } from "@/shared/api";
import { useAuthStore } from "@/features/auth/store/authStore";

import {
	inferConversationTitle,
	makeAssistantStub,
	makeUserMessage,
	useChatStore,
} from "../store/chatStore";
import type { ToolActivity } from "../types/chat";

export type SendMessageOptions = {
	useRag?: boolean;
	useWebSearch?: boolean;
	think?: boolean;
};

let toolSeq = 0;
const nextToolId = () => `tool_${Date.now()}_${toolSeq++}`;

/**
 * Real backend chat hook — backed by the **agentic** chat endpoint
 * (`GET /llm/agent/chat`).
 *
 * The agent can autonomously call tools (Gmail, Calendar, Google Tasks, local
 * tasks, web search, RAG) before answering, so the stream also carries
 * `tool_call` / `tool_result` events which we surface as `toolActivity` on the
 * assistant message.
 *
 * Flow:
 *   1. Ensure a backend chat exists (create it with the selected model on the
 *      first message, then reconcile the local conversation id to the
 *      backend-assigned chat id).
 *   2. Stream the reply over NDJSON, mapping events → store mutations.
 *
 * Exposes the same `{ sendMessage, stop }` surface the UI already consumes.
 */
export function useChat() {
	const createConversation = useChatStore((s) => s.createConversation);
	const reconcileConversationId = useChatStore(
		(s) => s.reconcileConversationId,
	);
	const renameConversation = useChatStore((s) => s.renameConversation);
	const appendMessage = useChatStore((s) => s.appendMessage);
	const updateMessage = useChatStore((s) => s.updateMessage);
	const setStreamingMessage = useChatStore((s) => s.setStreamingMessage);
	const setAbortController = useChatStore((s) => s.setAbortController);
	const abortController = useChatStore((s) => s.abortController);

	const sendMessage = useCallback(
		async (content: string, options: SendMessageOptions = {}) => {
			const trimmed = content.trim();
			if (!trimmed) return;

			const token = useAuthStore.getState().token;
			if (!token) return;

			const store = useChatStore.getState();
			const modelId = store.modelId || undefined;

			// Resolve / create the conversation.
			let conversationId: string =
				store.activeConversationId ?? createConversation();

			// If this conversation has no backend row yet (local id), create it
			// now with the selected model and reconcile the id.
			const isLocalId = conversationId.startsWith("conv_");
			if (isLocalId) {
				try {
					const chat = await llmPost.createChat(token, {
						title: inferConversationTitle(trimmed),
						model: modelId,
					});
					reconcileConversationId(conversationId, chat.id);
					conversationId = chat.id;
				} catch (err) {
					// If creation fails, surface an error message and bail.
					const assistant = makeAssistantStub(conversationId);
					appendMessage(makeUserMessage(conversationId, trimmed));
					appendMessage(assistant);
					updateMessage(assistant.id, (m) => ({
						...m,
						status: "error",
						content:
							err instanceof Error
								? err.message
								: "Failed to create chat.",
					}));
					return;
				}
			}

			const userMsg = makeUserMessage(conversationId, trimmed);
			appendMessage(userMsg);

			const assistant = makeAssistantStub(conversationId);
			appendMessage(assistant);
			setStreamingMessage(assistant.id);

			const controller = new AbortController();
			setAbortController(controller);

			try {
				await llmGet.streamAgentChat({
					token,
					prompt: trimmed,
					chatId: conversationId,
					think: options.think,
					signal: controller.signal,
					onEvent: (event) => {
						switch (event.type) {
							case "chat_id":
								// Backend confirms the chat id; reconcile if it
								// differs (e.g. it created a new one for us).
								if (event.data !== conversationId) {
									reconcileConversationId(
										conversationId,
										event.data,
									);
									conversationId = event.data;
								}
								break;
							case "agent_start":
								break;
							case "tool_call": {
								const entry: ToolActivity = {
									id: nextToolId(),
									name: event.name,
									args: event.args,
									status: "running",
								};
								updateMessage(assistant.id, (m) => ({
									...m,
									toolActivity: [
										...(m.toolActivity ?? []),
										entry,
									],
								}));
								break;
							}
							case "tool_result":
								updateMessage(assistant.id, (m) => {
									const activity = [...(m.toolActivity ?? [])];
									// Resolve the most recent running call with
									// the same tool name.
									for (let i = activity.length - 1; i >= 0; i--) {
										if (
											activity[i].name === event.name &&
											activity[i].status === "running"
										) {
											activity[i] = {
												...activity[i],
												result: event.result,
												status: "done",
											};
											break;
										}
									}
									return { ...m, toolActivity: activity };
								});
								break;
							case "content":
								updateMessage(assistant.id, (m) => ({
									...m,
									content: m.content + event.content,
								}));
								break;
							case "done":
							default:
								break;
						}
					},
				});

				updateMessage(assistant.id, (m) => ({
					...m,
					status: "complete",
				}));

				// Make sure the sidebar title reflects the first prompt.
				const conv = useChatStore
					.getState()
					.conversations.find((c) => c.id === conversationId);
				if (conv && (conv.title === "New chat" || !conv.title)) {
					renameConversation(
						conversationId,
						inferConversationTitle(trimmed),
					);
				}
			} catch (err) {
				if (controller.signal.aborted) {
					updateMessage(assistant.id, (m) => ({
						...m,
						status: "complete",
					}));
				} else {
					updateMessage(assistant.id, (m) => ({
						...m,
						status: "error",
						content:
							m.content ||
							(err instanceof Error
								? err.message
								: "Something went wrong while generating the response."),
					}));
				}
			} finally {
				setStreamingMessage(null);
				setAbortController(null);
			}
		},
		[
			appendMessage,
			createConversation,
			reconcileConversationId,
			renameConversation,
			setAbortController,
			setStreamingMessage,
			updateMessage,
		],
	);

	const stop = useCallback(() => {
		if (abortController) {
			abortController.abort();
		}
	}, [abortController]);

	return { sendMessage, stop };
}
