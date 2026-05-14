import { useMemo } from "react";

import {
	selectActiveMessages,
	useChatStore,
} from "../store/chatStore";
import { useStickToBottom } from "../hooks/useStickToBottom";
import { MessageBubble } from "./MessageBubble";
import { ScrollToBottomButton } from "./ScrollToBottomButton";

export function MessageList() {
	const messages = useChatStore(selectActiveMessages);
	const streamingId = useChatStore((s) => s.streamingMessageId);
	const conversationId = useChatStore((s) => s.activeConversationId);

	// Find the latest user message id — used to trigger a guaranteed
	// scroll-to-bottom when the user just sent something.
	const lastUserMessageId = useMemo(() => {
		for (let i = messages.length - 1; i >= 0; i--) {
			const m = messages[i];
			if (m.role === "user") return m.id;
		}
		return null;
	}, [messages]);

	const { isAtBottom, scrollToBottom, containerProps } = useStickToBottom({
		messageCount: messages.length,
		streamingId,
		conversationId,
		lastUserMessageId,
	});

	return (
		<div className="relative flex-1 min-h-0">
			<div
				{...containerProps}
				className="absolute inset-0 overflow-y-auto"
			>
				<div className="mx-auto w-full max-w-[760px] px-4 sm:px-6 py-8 flex flex-col gap-8">
					{messages.map((msg) => (
						<MessageBubble
							key={msg.id}
							message={msg}
							isStreaming={msg.id === streamingId}
						/>
					))}
				</div>
			</div>

			<ScrollToBottomButton
				visible={!isAtBottom}
				onClick={() => scrollToBottom("smooth")}
			/>
		</div>
	);
}
