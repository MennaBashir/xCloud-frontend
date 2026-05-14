import { useCallback, useEffect, useRef, useState } from "react";

/**
 * ChatGPT-style scroll discipline for a message list.
 *
 * Rules:
 *  - Conversation change → instant jump to bottom, re-engage stick.
 *  - New user message → instant jump to bottom, re-engage stick.
 *  - Streaming tokens → auto-stick only if the user is at the bottom.
 *  - User manually scrolls up → release stick until they return to the bottom.
 *
 * Returns:
 *  - `isAtBottom`: whether the container is currently at (or within
 *    `threshold` px of) the bottom. Drives the "Scroll to latest" pill.
 *  - `scrollToBottom(behavior)`: imperative scroll + re-engage stick.
 *  - `containerProps`: spread onto the scrolling container to wire scroll
 *    detection.
 */
type Options = {
	threshold?: number;
};

type ContainerProps = {
	ref: React.RefObject<HTMLDivElement | null>;
	onScroll: () => void;
};

type Result = {
	isAtBottom: boolean;
	scrollToBottom: (behavior?: ScrollBehavior) => void;
	containerProps: ContainerProps;
};

const DEFAULT_THRESHOLD = 32;

export function useStickToBottom(
	deps: {
		messageCount: number;
		streamingId: string | null;
		conversationId: string | null;
		lastUserMessageId: string | null;
	},
	{ threshold = DEFAULT_THRESHOLD }: Options = {},
): Result {
	const ref = useRef<HTMLDivElement | null>(null);
	const stickRef = useRef<boolean>(true);
	const [isAtBottom, setIsAtBottom] = useState(true);

	const checkAtBottom = useCallback(
		(el: HTMLDivElement): boolean => {
			const distance =
				el.scrollHeight - el.scrollTop - el.clientHeight;
			return distance <= threshold;
		},
		[threshold],
	);

	const scrollToBottom = useCallback(
		(behavior: ScrollBehavior = "smooth") => {
			const el = ref.current;
			if (!el) return;
			el.scrollTo({ top: el.scrollHeight, behavior });
			stickRef.current = true;
			setIsAtBottom(true);
		},
		[],
	);

	const handleScroll = useCallback(() => {
		const el = ref.current;
		if (!el) return;
		const atBottom = checkAtBottom(el);
		stickRef.current = atBottom;
		setIsAtBottom((prev) => (prev === atBottom ? prev : atBottom));
	}, [checkAtBottom]);

	// Conversation switch → instant snap to bottom, re-engage stick.
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		// Defer to next frame so the new conversation's DOM has flushed.
		const id = window.requestAnimationFrame(() => {
			el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
			stickRef.current = true;
			setIsAtBottom(true);
		});
		return () => window.cancelAnimationFrame(id);
	}, [deps.conversationId]);

	// New user message → always scroll to bottom.
	useEffect(() => {
		if (!deps.lastUserMessageId) return;
		const el = ref.current;
		if (!el) return;
		const id = window.requestAnimationFrame(() => {
			el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
			stickRef.current = true;
			setIsAtBottom(true);
		});
		return () => window.cancelAnimationFrame(id);
	}, [deps.lastUserMessageId]);

	// Streaming tokens / new assistant content → only stick if user is still
	// at the bottom. We listen for messageCount AND streamingId so we react to
	// both incremental tokens and full-message appends.
	useEffect(() => {
		if (!stickRef.current) return;
		const el = ref.current;
		if (!el) return;
		const id = window.requestAnimationFrame(() => {
			el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
		});
		return () => window.cancelAnimationFrame(id);
	}, [deps.messageCount, deps.streamingId]);

	return {
		isAtBottom,
		scrollToBottom,
		containerProps: { ref, onScroll: handleScroll },
	};
}
