/**
 * Mock chat service.
 *
 * Provides a fake token-by-token streaming API that mirrors the real
 * `useChat` interface from `@ai-sdk/react`. When the real backend ships,
 * only this file changes — components keep using the same hooks.
 *
 * In-memory only. Refresh wipes the state (per the project's mock-data
 * policy; auth is the single exception that persists).
 */
import type { Citation } from "../types/chat";

const RESPONSES: Array<{
	answer: string;
	citations?: Citation[];
}> = [
	{
		answer:
			"Based on Tuesday's sprint planning, the team agreed to lock the Q3 launch scope by Friday. Priya owns the engineering sign-off, Aisha owns the design review, and Marcus is preparing the leadership deck. Two open questions remain: whether to include the new pricing tier in the launch and whether the onboarding revamp ships in v1 or v2.",
		citations: [
			{
				id: "c1",
				kind: "meeting",
				title: "Sprint planning",
				detail: "Tuesday · 24 min",
			},
			{
				id: "c2",
				kind: "file",
				title: "Roadmap deck — Q3",
				detail: "Updated 5 hours ago",
			},
		],
	},
	{
		answer:
			"Here's a clean follow-up draft you can send today:\n\nSubject: Q3 launch — locked scope and next steps\n\nHi team,\n\nQuick recap from sprint planning: we're locking the launch scope by Friday. Aisha will run the design review next Wednesday, Marcus will share the leadership deck by EOD Thursday, and engineering sign-off is on me. Let me know if anything is blocking you.\n\nThanks,\nAlex",
		citations: [
			{
				id: "c3",
				kind: "meeting",
				title: "Sprint planning",
				detail: "Tuesday · 24 min",
			},
		],
	},
	{
		answer:
			"From the last three standups, the team has three recurring blockers: the analytics pipeline is still waiting on the data team, the design tokens migration is blocked on the brand review, and two engineers are on PTO next week which puts the launch checklist at risk. I'd surface these to leadership before Friday.",
		citations: [
			{
				id: "c4",
				kind: "meeting",
				title: "Mon standup",
				detail: "1 week ago",
			},
		],
	},
	{
		answer:
			"Three action items are still open from last week:\n\n1. Schedule the design review for the onboarding revamp — owner: Aisha — by next Wednesday\n2. Update the pricing page with the new tier — owner: Devon — by EOD Thursday\n3. Share the Q3 roadmap deck with leadership — owner: Marcus — by Friday\n\nThe other 4 items are marked done.",
	},
	{
		answer:
			"Yes — Priya confirmed in Tuesday's planning that we're shipping the onboarding revamp in v2. The reasoning was that the design review couldn't land before the launch window, and pushing it gives the team a clean cut without rushing the experience. The decision was unanimous.",
		citations: [
			{
				id: "c5",
				kind: "meeting",
				title: "Sprint planning",
				detail: "Tuesday · 24 min",
			},
		],
	},
];

const TOKENIZE_RE = /(\s+|\S+)/g;

function delay(ms: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function pickResponse(prompt: string): {
	answer: string;
	citations?: Citation[];
} {
	const p = prompt.toLowerCase();
	if (p.includes("decid") || p.includes("decision") || p.includes("agree"))
		return RESPONSES[0];
	if (p.includes("email") || p.includes("draft") || p.includes("follow"))
		return RESPONSES[1];
	if (p.includes("blocker") || p.includes("standup") || p.includes("risk"))
		return RESPONSES[2];
	if (p.includes("action") || p.includes("task") || p.includes("todo"))
		return RESPONSES[3];
	if (p.includes("onboard") || p.includes("revamp")) return RESPONSES[4];
	// Fallback: deterministic round-robin based on string length
	return RESPONSES[prompt.length % RESPONSES.length];
}

/**
 * Run a fake streaming completion.
 *
 * `onToken` is called for each token (~ word boundary). `signal` lets the
 * caller abort streaming early (mirrors `fetch` AbortSignal semantics).
 */
export async function streamMockReply({
	prompt,
	onToken,
	onCitations,
	signal,
}: {
	prompt: string;
	onToken: (token: string) => void;
	onCitations?: (citations: Citation[]) => void;
	signal?: AbortSignal;
}): Promise<void> {
	const response = pickResponse(prompt);
	const tokens = response.answer.match(TOKENIZE_RE) ?? [];

	// Initial "thinking" pause
	await delay(420);
	if (signal?.aborted) return;

	for (const token of tokens) {
		if (signal?.aborted) return;
		onToken(token);
		// Realistic token rhythm: punctuation pauses, spaces are quick
		const isWord = /\w/.test(token);
		const isPunctuationBreak = /[.!?]\s?$/.test(token);
		await delay(isPunctuationBreak ? 220 : isWord ? 26 + Math.random() * 38 : 14);
	}

	if (response.citations && !signal?.aborted) {
		await delay(180);
		if (!signal?.aborted) onCitations?.(response.citations);
	}
}

/**
 * Auto-generate a conversation title from the first user message.
 * Falls back to "New chat" if the message is too short.
 */
export function inferConversationTitle(firstMessage: string): string {
	const cleaned = firstMessage.trim().replace(/\s+/g, " ");
	if (cleaned.length < 4) return "New chat";
	if (cleaned.length <= 48) return cleaned;
	return cleaned.slice(0, 48).trim() + "…";
}
