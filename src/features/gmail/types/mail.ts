/**
 * Gmail feature types.
 *
 * Shape designed to map cleanly onto Gmail API responses (`thread`, `message`,
 * `label`) so the mock service can be replaced without touching consumers.
 */

export type Folder =
	| "inbox"
	| "starred"
	| "sent"
	| "drafts"
	| "archive"
	| "trash";

export type LabelTone = "ai" | "indigo" | "emerald" | "amber" | "rose" | "neutral";

export type Label = {
	id: string;
	name: string;
	tone: LabelTone;
};

export type Participant = {
	name: string;
	email: string;
	avatarUrl?: string;
};

export type Message = {
	id: string;
	threadId: string;
	from: Participant;
	to: Participant[];
	cc?: Participant[];
	subject: string;
	body: string;
	snippet: string;
	sentAt: string;
	attachments?: Array<{ name: string; sizeBytes: number }>;
};

export type Thread = {
	id: string;
	subject: string;
	snippet: string;
	participants: Participant[];
	messages: Message[];
	folder: Folder;
	labels: string[];
	unread: boolean;
	starred: boolean;
	updatedAt: string;
	/** AI-generated summary, populated lazily on demand. */
	aiSummary?: string;
};

export type ThreadsFilter = {
	folder: Folder;
	query: string;
	labelId?: string;
};

export type ComposeDraft = {
	to: string;
	subject: string;
	body: string;
};
