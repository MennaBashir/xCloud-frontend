import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useCommandPalette } from "@/shared/layout/command-palette-store";
import { useShortcutsStore } from "@/shared/layout/shortcuts-store";

const SEQUENCE_TIMEOUT_MS = 800;

function isTypingInField(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	const tag = target.tagName.toLowerCase();
	if (
		tag === "input" ||
		tag === "textarea" ||
		tag === "select" ||
		target.isContentEditable
	) {
		return true;
	}
	return false;
}

/**
 * Global keyboard shortcuts.
 *
 *  ⌘K / Ctrl+K   — open command palette (already handled in CommandPalette)
 *  ?             — open shortcuts help
 *  g then f      — go to Files
 *  g then c      — go to Calendar
 *  g then m      — go to Meeting
 *  g then a      — go to Chat AI
 *  g then r      — go to RAG (documents)
 *  g then i      — go to Inbox
 *  g then h      — go to Home (landing)
 *
 * Mounted once per AppLayout. Honors input/textarea focus (no hijacking).
 */
export function useGlobalShortcuts() {
	const navigate = useNavigate();
	const openCommandPalette = useCommandPalette((s) => s.open);
	const openShortcuts = useShortcutsStore((s) => s.open);
	const leaderRef = useRef<{ key: string; at: number } | null>(null);

	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			// Don't intercept while typing
			if (isTypingInField(event.target)) {
				leaderRef.current = null;
				return;
			}

			// ⌘K / Ctrl+K — command palette
			if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				openCommandPalette();
				return;
			}

			// ? — shortcuts help
			if (event.key === "?" && !event.metaKey && !event.ctrlKey) {
				event.preventDefault();
				openShortcuts();
				return;
			}

			// g leader
			if (event.key === "g" && !event.metaKey && !event.ctrlKey && !event.altKey) {
				leaderRef.current = { key: "g", at: Date.now() };
				return;
			}

			// Resolve leader sequence
			const leader = leaderRef.current;
			if (
				leader?.key === "g" &&
				Date.now() - leader.at < SEQUENCE_TIMEOUT_MS &&
				!event.metaKey &&
				!event.ctrlKey
			) {
				const k = event.key.toLowerCase();
				const target: Record<string, string> = {
					f: "/app",
					c: "/app/calendar",
					m: "/app/meeting",
					a: "/app/chat",
					r: "/app/rag",
					i: "/app/gmail",
					n: "/app/notifications",
					h: "/",
				};
				if (target[k]) {
					event.preventDefault();
					navigate(target[k]);
					leaderRef.current = null;
				}
				return;
			}

			leaderRef.current = null;
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [navigate, openCommandPalette, openShortcuts]);
}
