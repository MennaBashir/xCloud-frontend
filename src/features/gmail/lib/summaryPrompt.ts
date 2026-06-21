import type { Thread } from "../types/mail";
import { htmlToText } from "./htmlToText";

/**
 * Build a chat prompt that asks the assistant to summarize an email thread.
 * Used to hand the email content off to the Chat AI tab.
 */
export function buildEmailSummaryPrompt(thread: Thread): string {
	const transcript = thread.messages
		.map((m) => {
			const date = m.sentAt ? new Date(m.sentAt).toLocaleString() : "";
			const to = m.to.map((p) => p.name || p.email).join(", ");
			return [
				`From: ${m.from.name || m.from.email} <${m.from.email}>`,
				to ? `To: ${to}` : null,
				date ? `Date: ${date}` : null,
				"",
				htmlToText(m.body),
			]
				.filter(Boolean)
				.join("\n");
		})
		.join("\n\n---\n\n");

	return [
		"Summarize the following email thread. Give me:",
		"- A one-sentence TL;DR",
		"- The key points as concise bullets",
		"- Any action items, decisions, or deadlines (with owners if mentioned)",
		"",
		`Subject: ${thread.subject}`,
		"",
		transcript,
	].join("\n");
}
