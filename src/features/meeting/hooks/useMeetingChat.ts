import { useCallback } from "react";
import { usePubSub } from "@videosdk.live/react-sdk";

export type ChatMessage = {
	id: string;
	message: string;
	senderId: string;
	senderName: string;
	timestamp: string;
};

export type MeetingChat = {
	messages: ChatMessage[];
	send: (text: string) => Promise<void>;
};

/**
 * Single source of truth for meeting chat.
 *
 * IMPORTANT: this must be called from an ALWAYS-MOUNTED component for the
 * duration of the meeting (e.g. MeetingRoom), NOT from the chat panel which
 * mounts/unmounts as the user opens/closes it.
 *
 * `usePubSub` subscribes on mount and unsubscribes on unmount. If we called it
 * inside the conditionally-rendered ChatPanel, the subscription would be torn
 * down every time the panel closes and re-created (re-fetching old messages)
 * on open — which is exactly why new messages only appeared after a
 * close/reopen and never arrived live. Keeping the subscription mounted for
 * the whole meeting makes delivery real-time and panel-independent.
 */
export function useMeetingChat(): MeetingChat {
	const { publish, messages } = usePubSub("CHAT") as {
		publish: (msg: string, opts: { persist: boolean }) => Promise<void>;
		messages: ChatMessage[];
	};

	const send = useCallback(
		async (text: string) => {
			const trimmed = text.trim();
			if (!trimmed) return;
			await publish(trimmed, { persist: true });
		},
		[publish],
	);

	return { messages, send };
}
