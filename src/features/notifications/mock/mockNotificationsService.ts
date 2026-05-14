/**
 * Mock notifications service.
 *
 * In-memory list, refreshed when the user reloads. Methods mirror the
 * shape of a future REST/SSE endpoint so the swap is a one-file change.
 */
import type { Notification, NotificationActor } from "../types/notification";

const PEOPLE: Record<string, NotificationActor> = {
	priya: {
		id: "u_priya",
		name: "Priya Raman",
		email: "priya@northwave.io",
	},
	marcus: {
		id: "u_marcus",
		name: "Marcus Vega",
		email: "marcus@northwave.io",
	},
	aisha: {
		id: "u_aisha",
		name: "Aisha Karim",
		email: "aisha@northwave.io",
	},
	devon: {
		id: "u_devon",
		name: "Devon Park",
		email: "devon@northwave.io",
	},
	system: {
		id: "system",
		name: "SprintifAI",
	},
};

function offsetIso(daysAgo: number, hoursAgo = 0, minutesAgo = 0): string {
	const d = new Date();
	d.setDate(d.getDate() - daysAgo);
	d.setHours(d.getHours() - hoursAgo);
	d.setMinutes(d.getMinutes() - minutesAgo);
	return d.toISOString();
}

const SEED: Notification[] = [
	{
		id: "n_001",
		kind: "task",
		title: "Design review for onboarding revamp",
		body: "Aisha assigned this to you. Due Wednesday.",
		createdAt: offsetIso(0, 0, 2),
		read: false,
		actor: PEOPLE.aisha,
		relatedTo: {
			kind: "task",
			id: "t_001",
			label: "Onboarding revamp",
		},
		ctaLabel: "Open task",
		ctaHref: "/app",
	},
	{
		id: "n_002",
		kind: "meeting",
		title: "Sprint planning starts in 15 minutes",
		body: "Priya, Marcus, Aisha, and 2 others are joining.",
		createdAt: offsetIso(0, 0, 15),
		read: false,
		actor: PEOPLE.system,
		relatedTo: {
			kind: "meeting",
			id: "m_001",
			label: "Sprint planning",
		},
		ctaLabel: "Join meeting",
		ctaHref: "/app/meeting",
	},
	{
		id: "n_003",
		kind: "decision",
		title: "Summary ready for Sprint planning",
		body: "AI extracted 4 decisions and 6 action items from the meeting.",
		createdAt: offsetIso(0, 1),
		read: false,
		actor: PEOPLE.system,
		relatedTo: {
			kind: "thread",
			id: "th_002",
			label: "Sprint planning recap",
		},
		ctaLabel: "View summary",
		ctaHref: "/app/chat",
	},
	{
		id: "n_004",
		kind: "mention",
		title: "Marcus mentioned you",
		body: "Pricing tier update — need copy by EOD Thursday.",
		createdAt: offsetIso(0, 3),
		read: false,
		actor: PEOPLE.marcus,
		relatedTo: {
			kind: "thread",
			id: "th_003",
			label: "Pricing tier update",
		},
		ctaLabel: "Open thread",
		ctaHref: "/app/gmail",
	},
	{
		id: "n_005",
		kind: "system",
		title: "Added to Q3 launch workspace",
		body: "You can now collaborate on files, meetings, and tasks for Q3 launch.",
		createdAt: offsetIso(0, 6),
		read: true,
		actor: PEOPLE.system,
	},
	{
		id: "n_006",
		kind: "task",
		title: "Devon completed 'Update pricing page'",
		body: "1 task closed today.",
		createdAt: offsetIso(1, 2),
		read: true,
		actor: PEOPLE.devon,
		relatedTo: {
			kind: "task",
			id: "t_002",
			label: "Update pricing page",
		},
	},
	{
		id: "n_007",
		kind: "system",
		title: "New file uploaded",
		body: "Roadmap deck — Q3 was uploaded by Marcus.",
		createdAt: offsetIso(1, 5),
		read: true,
		actor: PEOPLE.marcus,
		relatedTo: {
			kind: "file",
			id: "f_003",
			label: "Roadmap deck — Q3",
		},
		ctaLabel: "Open file",
		ctaHref: "/app",
	},
	{
		id: "n_008",
		kind: "meeting",
		title: "Priya scheduled 'Design review' for next Wednesday",
		body: "Recurring · 30 minutes · 5 attendees.",
		createdAt: offsetIso(2),
		read: true,
		actor: PEOPLE.priya,
		relatedTo: {
			kind: "event",
			id: "e_001",
			label: "Design review",
		},
		ctaLabel: "Open in calendar",
		ctaHref: "/app/calendar",
	},
	{
		id: "n_009",
		kind: "system",
		title: "New feature: AI thread summaries",
		body: "Every inbox thread now gets an AI summary on demand.",
		createdAt: offsetIso(3),
		read: true,
		actor: PEOPLE.system,
		ctaLabel: "Try it",
		ctaHref: "/app/gmail",
	},
	{
		id: "n_010",
		kind: "task",
		title: "You completed Q3 launch checklist",
		body: "8 of 8 items done. Nice work.",
		createdAt: offsetIso(7),
		read: true,
		actor: PEOPLE.system,
	},
];

let store: Notification[] = SEED.map((n) => ({ ...n }));

function delay(ms: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function sortByDateDesc(items: Notification[]): Notification[] {
	return items
		.slice()
		.sort((a, b) =>
			a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0,
		);
}

export async function listNotifications(): Promise<Notification[]> {
	await delay(180);
	return sortByDateDesc(store);
}

export async function markRead(id: string): Promise<void> {
	await delay(80);
	store = store.map((n) => (n.id === id ? { ...n, read: true } : n));
}

export async function markAllRead(): Promise<void> {
	await delay(140);
	store = store.map((n) => ({ ...n, read: true }));
}

export async function dismissNotification(id: string): Promise<void> {
	await delay(80);
	store = store.filter((n) => n.id !== id);
}

/**
 * Imperative push — used by feature side-effects (file upload, chat send,
 * AI summary completion) and by the simulated-arrival hook on chat mount.
 */
export function pushNotification(
	input: Omit<Notification, "id" | "createdAt" | "read"> & {
		read?: boolean;
	},
): Notification {
	const created: Notification = {
		id: `n_${Math.random().toString(36).slice(2, 10)}`,
		createdAt: new Date().toISOString(),
		read: input.read ?? false,
		kind: input.kind,
		title: input.title,
		body: input.body,
		actor: input.actor,
		relatedTo: input.relatedTo,
		ctaLabel: input.ctaLabel,
		ctaHref: input.ctaHref,
	};
	store = [created, ...store];
	return created;
}

/** Read-only snapshot — used by simulated-arrival to avoid clashes. */
export function snapshot(): Notification[] {
	return sortByDateDesc(store);
}
