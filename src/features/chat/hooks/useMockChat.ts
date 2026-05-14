import { useCallback } from "react";

import { streamMockReply } from "../mock/mockChatService";
import {
	makeAssistantStub,
	makeUserMessage,
	useChatStore,
} from "../store/chatStore";

/**
 * Mirror of `useChat` from `@ai-sdk/react`, but powered by `mockChatService`.
 *
 * Exposes:
 *   - sendMessage(content)
 *   - stop() — aborts the in-flight stream
 *
 * When the real backend lands, swap this hook for the real `useChat` and
 * adapt the shape if needed; nothing else in the chat feature changes.
 */
export function useMockChat() {
	const createConversation = useChatStore((s) => s.createConversation);
	const activeConversationId = useChatStore((s) => s.activeConversationId);
	const appendMessage = useChatStore((s) => s.appendMessage);
	const updateMessage = useChatStore((s) => s.updateMessage);
	const setStreamingMessage = useChatStore((s) => s.setStreamingMessage);
	const setAbortController = useChatStore((s) => s.setAbortController);
	const abortController = useChatStore((s) => s.abortController);

	const sendMessage = useCallback(
		async (content: string) => {
			const trimmed = content.trim();
			if (!trimmed) return;

			// Ensure we have an active conversation
			let conversationId = activeConversationId;
			if (!conversationId) {
				conversationId = createConversation();
			}

			const userMsg = makeUserMessage(conversationId, trimmed);
			appendMessage(userMsg);

			const assistant = makeAssistantStub(conversationId);
			appendMessage(assistant);
			setStreamingMessage(assistant.id);

			const controller = new AbortController();
			setAbortController(controller);

			try {
				await streamMockReply({
					prompt: trimmed,
					signal: controller.signal,
					onToken: (token) => {
						updateMessage(assistant.id, (m) => ({
							...m,
							content: m.content + token,
						}));
					},
					onCitations: (citations) => {
						updateMessage(assistant.id, (m) => ({
							...m,
							citations,
						}));
					},
				});

				updateMessage(assistant.id, (m) => ({
					...m,
					status: controller.signal.aborted ? "complete" : "complete",
				}));
			} catch (err) {
				console.error("[chat] streaming failed", err);
				updateMessage(assistant.id, (m) => ({
					...m,
					status: "error",
					content:
						m.content ||
						"Something went wrong while generating the response.",
				}));
			} finally {
				setStreamingMessage(null);
				setAbortController(null);
			}
		},
		[
			activeConversationId,
			appendMessage,
			createConversation,
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
