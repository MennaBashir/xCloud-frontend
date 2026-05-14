/**
 * Notification feature types.
 *
 * Shape is intentionally flat so it maps cleanly onto a future real-time
 * backend stream (websocket / SSE). Each notification can reference an
 * upstream entity (file, thread, event, meeting) to enable deep-linking.
 */

export type NotificationKind =
	| "task"
	| "meeting"
	| "decision"
	| "mention"
	| "system";

export type NotificationActor = {
	id: string;
	name: string;
	email?: string;
	avatarUrl?: string;
};

export type NotificationRelated =
	| { kind: "file"; id: string; label: string }
	| { kind: "thread"; id: string; label: string }
	| { kind: "event"; id: string; label: string }
	| { kind: "meeting"; id: string; label: string }
	| { kind: "task"; id: string; label: string };

export type Notification = {
	id: string;
	kind: NotificationKind;
	title: string;
	body: string;
	createdAt: string;
	read: boolean;
	actor?: NotificationActor;
	relatedTo?: NotificationRelated;
	/** Visible CTA label. */
	ctaLabel?: string;
	/** Where to send the user. */
	ctaHref?: string;
};

export type NotificationFilter =
	| "all"
	| "unread"
	| NotificationKind;
