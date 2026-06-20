/**
 * Real Gmail/email service.
 *
 * Backs the inbox UI with the xcloud FastAPI `/email/*` endpoints. Exposes the
 * SAME surface as `mock/mockGmailService.ts` so the components/hooks don't
 * change — only the import source does.
 *
 * Mapping notes:
 *   - The backend stores flat `Email` rows (one message). We model each email
 *     as a single-message `Thread` so the existing thread UI keeps working.
 *   - Backend folders are `inbox` and `sent`. UI virtual folders
 *     (`starred`, `drafts`, `archive`) have no server equivalent yet:
 *       • `starred`  → no server flag; returns [] (handled gracefully).
 *       • `archive`  → mapped to a client-only move (best-effort, no API).
 *       • `trash`    → delete on the server.
 */
import { emailGet } from "@/shared/api/get";
import type { EmailDto } from "@/shared/api/get/email";
import { emailPost } from "@/shared/api/post";
import { emailPut } from "@/shared/api/put";
import { emailDelete } from "@/shared/api/delete";

import { htmlToText } from "../lib/htmlToText";
import { decodeMimeWord } from "../lib/decodeMimeWord";
import type {
	ComposeDraft,
	Folder,
	Label,
	Participant,
	Thread,
	ThreadsFilter,
} from "../types/mail";

/** No server-side labels yet — keep the rail label list empty. */
export const LABELS: Label[] = [];

/**
 * Folder names the backend understands. "starred" is a virtual folder the
 * backend resolves across all folders; the rest map 1:1 to Gmail folders.
 */
function serverFolder(folder: Folder): string {
	return folder;
}

/** Parse `"Name <email@x.com>"` or a bare address into a Participant. */
function parseParticipant(raw: string): Participant {
	const trimmed = decodeMimeWord(raw).trim();
	const match = trimmed.match(/^(.*?)\s*<([^>]+)>$/);
	if (match) {
		const name = match[1].replace(/^["']|["']$/g, "").trim();
		const email = match[2].trim();
		return { name: name || email.split("@")[0], email };
	}
	if (trimmed.includes("@")) {
		return { name: trimmed.split("@")[0], email: trimmed };
	}
	return { name: trimmed || "Unknown", email: trimmed };
}

function parseRecipients(raw: string): Participant[] {
	return (raw ?? "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean)
		.map(parseParticipant);
}

function snippetOf(body: string | null): string {
	return htmlToText(body).replace(/\s+/g, " ").trim().slice(0, 140);
}

/** Map a backend Email row into a single-message Thread. */
function toThread(email: EmailDto): Thread {
	const from = parseParticipant(email.sender);
	const to = parseRecipients(email.recipients);
	const sentAt =
		email.received_at ?? email.created_at ?? new Date().toISOString();
	const subject = decodeMimeWord(email.subject) || "(no subject)";
	const body = email.body ?? "";
	const KNOWN: Folder[] = [
		"inbox",
		"sent",
		"drafts",
		"archive",
		"trash",
	];
	const folder: Folder = KNOWN.includes(email.folder as Folder)
		? (email.folder as Folder)
		: "inbox";

	return {
		id: email.id,
		subject,
		snippet: snippetOf(email.body),
		participants: [from, ...to],
		messages: [
			{
				id: email.id,
				threadId: email.id,
				from,
				to,
				subject,
				body,
				snippet: snippetOf(email.body),
				sentAt,
			},
		],
		folder,
		labels: [],
		unread: !email.is_read,
		starred: Boolean(email.is_starred),
		updatedAt: sentAt,
	};
}

function applyQuery(threads: Thread[], query: string): Thread[] {
	const q = query.trim().toLowerCase();
	if (!q) return threads;
	return threads.filter((t) => {
		const haystack = [
			t.subject,
			t.snippet,
			...t.participants.map((p) => `${p.name} ${p.email}`),
		]
			.join(" ")
			.toLowerCase();
		return haystack.includes(q);
	});
}

export async function listThreads(filter: ThreadsFilter): Promise<Thread[]> {
	const res = await emailGet.listEmails({
		folder: serverFolder(filter.folder),
		page: 1,
		perPage: 100,
	});
	const threads = res.emails.map(toThread);
	const sorted = threads.sort((a, b) =>
		a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0,
	);
	return applyQuery(sorted, filter.query);
}

export async function getThread(id: string): Promise<Thread | null> {
	try {
		const email = await emailGet.getEmail(id);
		return toThread(email);
	} catch {
		return null;
	}
}

export async function markRead(id: string, unread = false): Promise<void> {
	// Backend only supports marking as read.
	if (!unread) {
		await emailPut.markEmailRead(id);
	}
}

/** Star/unstar — writes back to Gmail. Needs the current state to toggle. */
export async function toggleStar(id: string): Promise<void> {
	const current = await emailGet.getEmail(id);
	await emailPut.setEmailStar(id, !current.is_starred);
}

export async function moveThread(
	id: string,
	folder: Folder,
): Promise<void> {
	if (folder === "trash") {
		await emailDelete.deleteEmail(id);
	} else if (folder === "archive") {
		await emailPut.archiveEmail(id);
	}
}

export async function summarizeThread(_id: string): Promise<string> {
	void _id;
	throw new Error("Summary is not available yet.");
}

export async function sendDraft(draft: ComposeDraft): Promise<Thread> {
	const email = await emailPost.sendEmail({
		to: draft.to,
		subject: draft.subject,
		body: draft.body,
	});
	return toThread(email);
}

export async function deleteThread(id: string): Promise<void> {
	await emailDelete.deleteEmail(id);
}

export async function archiveThread(id: string): Promise<void> {
	await emailPut.archiveEmail(id);
}

export async function getFolderCounts(): Promise<Record<Folder, number>> {
	const counts: Record<Folder, number> = {
		inbox: 0,
		starred: 0,
		sent: 0,
		drafts: 0,
		archive: 0,
		trash: 0,
	};
	const folders: Folder[] = [
		"inbox",
		"starred",
		"sent",
		"drafts",
		"archive",
		"trash",
	];
	try {
		const results = await Promise.all(
			folders.map((f) =>
				emailGet.listEmails({ folder: f, page: 1, perPage: 1 }),
			),
		);
		folders.forEach((f, i) => {
			counts[f] = results[i].total;
		});
	} catch {
		/* leave zeros on failure */
	}
	return counts;
}

/** Pull new mail from the server (IMAP/Gmail sync). */
export async function syncInbox(): Promise<emailPost.SyncResult> {
	return emailPost.syncInbox();
}
