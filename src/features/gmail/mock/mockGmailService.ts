/**
 * Mock Gmail service.
 *
 * In-memory thread store with realistic seeded data. Methods mirror the
 * shape of a real Gmail-style API:
 *   listThreads(filter), getThread(id), markRead(id), markUnread(id),
 *   toggleStar(id), moveToFolder(id, folder), summarize(id), sendDraft(...).
 *
 * Single point of change when the real backend lands.
 */
import type {
	ComposeDraft,
	Folder,
	Label,
	Message,
	Participant,
	Thread,
	ThreadsFilter,
} from "../types/mail";

export const LABELS: Label[] = [
	{ id: "lbl_q3", name: "Q3 launch", tone: "indigo" },
	{ id: "lbl_design", name: "Design", tone: "ai" },
	{ id: "lbl_pricing", name: "Pricing", tone: "amber" },
	{ id: "lbl_sales", name: "Sales", tone: "emerald" },
	{ id: "lbl_billing", name: "Billing", tone: "rose" },
	{ id: "lbl_misc", name: "Misc", tone: "neutral" },
];

const ME: Participant = {
	name: "Alex Morgan",
	email: "demo@sprintifai.com",
};

const PEOPLE: Record<string, Participant> = {
	jordan: { name: "Jordan Chen", email: "jordan.chen@northwave.io" },
	priya: { name: "Priya Raman", email: "priya@northwave.io" },
	marcus: { name: "Marcus Vega", email: "marcus@northwave.io" },
	aisha: { name: "Aisha Karim", email: "aisha@northwave.io" },
	devon: { name: "Devon Park", email: "devon@northwave.io" },
	clara: { name: "Clara Hoffman", email: "clara@acmecorp.com" },
	sam: { name: "Sam Okafor", email: "sam.okafor@helio.io" },
	noor: { name: "Noor Al-Rashid", email: "noor@brightside.co" },
	billing: { name: "SprintifAI Billing", email: "billing@sprintifai.com" },
	support: { name: "GitHub", email: "noreply@github.com" },
};

function offsetIso(daysAgo: number, minutesAgo = 0): string {
	const d = new Date();
	d.setDate(d.getDate() - daysAgo);
	d.setMinutes(d.getMinutes() - minutesAgo);
	return d.toISOString();
}

function msg(
	threadId: string,
	from: Participant,
	to: Participant[],
	subject: string,
	body: string,
	sentAt: string,
	id?: string,
): Message {
	const snippet = body.replace(/\s+/g, " ").slice(0, 140);
	return {
		id: id ?? `m_${Math.random().toString(36).slice(2, 9)}`,
		threadId,
		from,
		to,
		subject,
		body,
		snippet,
		sentAt,
	};
}

function thread(input: {
	id: string;
	subject: string;
	folder?: Folder;
	labels?: string[];
	unread?: boolean;
	starred?: boolean;
	messages: Message[];
}): Thread {
	const last = input.messages[input.messages.length - 1];
	const participants = Array.from(
		new Map(
			input.messages
				.flatMap((m) => [m.from, ...m.to])
				.map((p) => [p.email, p]),
		).values(),
	);
	return {
		id: input.id,
		subject: input.subject,
		snippet: last.snippet,
		participants,
		messages: input.messages,
		folder: input.folder ?? "inbox",
		labels: input.labels ?? [],
		unread: input.unread ?? true,
		starred: input.starred ?? false,
		updatedAt: last.sentAt,
	};
}

const SEED: Thread[] = [
	thread({
		id: "th_001",
		subject: "Re: Q3 launch — final scope",
		labels: ["lbl_q3"],
		starred: true,
		messages: [
			msg(
				"th_001",
				PEOPLE.priya,
				[ME],
				"Q3 launch — final scope",
				"Hey Alex,\n\nClosing out the Q3 scope today. Engineering, design, and product have all signed off on the trimmed list. Two items to confirm with you:\n\n1. Are we including the new pricing tier in the launch? Marcus needs to know by Wednesday so legal can review.\n2. Onboarding revamp — v1 or v2? Aisha says v2 is the only realistic option without slipping the date.\n\nLet me know your thinking by EOD Tuesday and we'll lock it.\n\nThanks,\nPriya",
				offsetIso(0, 12),
			),
			msg(
				"th_001",
				PEOPLE.jordan,
				[ME, PEOPLE.priya],
				"Re: Q3 launch — final scope",
				"Quick add — I'm happy to take point on the launch comms if helpful. Have a draft press kit ready to go once scope is locked.\n\nJordan",
				offsetIso(0, 4),
			),
		],
	}),
	thread({
		id: "th_002",
		subject: "Sprint planning recap — decisions and owners",
		labels: ["lbl_q3"],
		messages: [
			msg(
				"th_002",
				PEOPLE.priya,
				[ME, PEOPLE.marcus, PEOPLE.aisha, PEOPLE.devon],
				"Sprint planning recap — decisions and owners",
				"Team,\n\nSharing the decisions from this morning's planning while it's fresh:\n\n- Lock Q3 scope by Friday (Priya)\n- Design review for onboarding revamp moved to next Wednesday (Aisha)\n- Update pricing page with the new tier by EOD Thursday (Devon)\n- Share roadmap deck with leadership by Friday (Marcus)\n\nNothing blocking right now. Ping me if any of this conflicts with your week.\n\nPriya",
				offsetIso(0, 90),
			),
		],
	}),
	thread({
		id: "th_003",
		subject: "Pricing tier update — need copy by EOD Thursday",
		labels: ["lbl_pricing", "lbl_q3"],
		messages: [
			msg(
				"th_003",
				PEOPLE.marcus,
				[ME, PEOPLE.devon],
				"Pricing tier update — need copy by EOD Thursday",
				"Hi both,\n\nWe need the final copy for the new \"Scale\" tier on the pricing page by EOD Thursday. Devon will own the page changes; I'll provide the feature matrix by Tuesday morning.\n\nAlex — can you sign off on positioning ahead of the design review?\n\nThanks,\nMarcus",
				offsetIso(0, 240),
			),
		],
	}),
	thread({
		id: "th_004",
		subject: "Demo recording — Acme prospect",
		labels: ["lbl_sales"],
		messages: [
			msg(
				"th_004",
				PEOPLE.clara,
				[ME],
				"Demo recording — Acme prospect",
				"Alex,\n\nThanks for the demo yesterday. The team here loved the calendar-sync angle. We'd like to bring our VP of Operations into a follow-up next week to see the meeting-to-task flow end to end. Tuesday or Wednesday afternoon?\n\nClara",
				offsetIso(1, 30),
			),
		],
	}),
	thread({
		id: "th_005",
		subject: "Welcome to the team — onboarding plan",
		messages: [
			msg(
				"th_005",
				PEOPLE.aisha,
				[ME],
				"Welcome to the team — onboarding plan",
				"Welcome aboard! Sharing the onboarding plan I put together — first week is mostly tooling setup and reading our internal docs, week two we start pairing you with feature owners. Let me know if anything looks off.\n\nAisha",
				offsetIso(1, 200),
				"m_005a",
			),
		],
	}),
	thread({
		id: "th_006",
		subject: "Invoice #INV-2026-118 — payment receipt",
		labels: ["lbl_billing"],
		unread: false,
		messages: [
			msg(
				"th_006",
				PEOPLE.billing,
				[ME],
				"Invoice #INV-2026-118 — payment receipt",
				"This is a receipt for your recent payment of $480.00 on your SprintifAI Team plan. No action needed. The next invoice is scheduled for the 1st of next month.\n\nThanks,\nSprintifAI Billing",
				offsetIso(2),
			),
		],
	}),
	thread({
		id: "th_007",
		subject: "[PR review] feat(meeting): refactor BottomBar to shadcn",
		labels: ["lbl_misc"],
		unread: false,
		messages: [
			msg(
				"th_007",
				PEOPLE.support,
				[ME],
				"[PR review] feat(meeting): refactor BottomBar to shadcn",
				"Devon Park requested your review on PR #284 in northwave/sprintifai. Changes touch 12 files in src/features/meeting. Estimated review time: 18 minutes.\n\nView on GitHub →",
				offsetIso(2, 80),
			),
		],
	}),
	thread({
		id: "th_008",
		subject: "Brand review — design tokens migration",
		labels: ["lbl_design"],
		messages: [
			msg(
				"th_008",
				PEOPLE.aisha,
				[ME, PEOPLE.priya],
				"Brand review — design tokens migration",
				"Final round of brand review on the new token system. I've attached the export from Figma. Big shifts: we're dropping the legacy skyblue palette in favor of the electric blue accent + AI tint. Should land on staging this week.\n\nAisha",
				offsetIso(3),
			),
		],
	}),
	thread({
		id: "th_009",
		subject: "Customer interview — Helio Labs",
		labels: ["lbl_sales"],
		messages: [
			msg(
				"th_009",
				PEOPLE.sam,
				[ME],
				"Customer interview — Helio Labs",
				"Hey Alex, would your team have 30 minutes next Wednesday to chat about how Helio Labs is using SprintifAI for our weekly retros? Happy to share screen-recordings of our workflow.\n\nSam",
				offsetIso(3, 130),
			),
		],
	}),
	thread({
		id: "th_010",
		subject: "Mobile launch — hero asset feedback",
		labels: ["lbl_design"],
		messages: [
			msg(
				"th_010",
				PEOPLE.devon,
				[ME, PEOPLE.aisha],
				"Mobile launch — hero asset feedback",
				"Two minor notes on the mobile hero: the indigo glow is a touch too saturated on iOS dark mode, and the secondary CTA is getting clipped at the 320px breakpoint. Easy fixes — wanted to flag them before we ship.\n\nDevon",
				offsetIso(4),
			),
		],
	}),
	thread({
		id: "th_011",
		subject: "Re: Roadmap deck for leadership",
		labels: ["lbl_q3"],
		unread: false,
		messages: [
			msg(
				"th_011",
				PEOPLE.marcus,
				[ME],
				"Roadmap deck for leadership",
				"Sharing the v3 of the deck. I cut down to 9 slides and moved the long-term bets to the appendix. Leadership review is Friday 2pm.\n\nMarcus",
				offsetIso(5),
			),
		],
	}),
	thread({
		id: "th_012",
		subject: "Quarterly OKR review — your input needed",
		messages: [
			msg(
				"th_012",
				PEOPLE.priya,
				[ME],
				"Quarterly OKR review — your input needed",
				"Alex, can you draft your Q3 OKR self-assessment by Monday next week? Format is the usual 1-pager — context, key results, score, learnings.\n\nP.",
				offsetIso(6, 30),
			),
		],
	}),
	thread({
		id: "th_013",
		subject: "Office hours — open slot Thursday",
		labels: ["lbl_misc"],
		unread: false,
		messages: [
			msg(
				"th_013",
				PEOPLE.noor,
				[ME],
				"Office hours — open slot Thursday",
				"Heads up — I opened an office-hours slot this Thursday at 3pm if you want to chat about anything ahead of the launch. Otherwise, see you at the planning.\n\nNoor",
				offsetIso(7),
			),
		],
	}),
];

// Mutable in-memory store, seeded once.
let store: Thread[] = SEED.map((t) => ({ ...t, messages: [...t.messages] }));

function delay(ms: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function applyFilter(items: Thread[], filter: ThreadsFilter): Thread[] {
	let out = items.slice();

	// Folder gate. "starred" is a virtual folder — show starred regardless
	// of actual folder, except trash.
	if (filter.folder === "starred") {
		out = out.filter((t) => t.starred && t.folder !== "trash");
	} else {
		out = out.filter((t) => t.folder === filter.folder);
	}

	if (filter.labelId) {
		out = out.filter((t) => t.labels.includes(filter.labelId!));
	}

	const q = filter.query.trim().toLowerCase();
	if (q.length > 0) {
		out = out.filter((t) => {
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

	return out.sort((a, b) =>
		a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0,
	);
}

export async function listThreads(filter: ThreadsFilter): Promise<Thread[]> {
	await delay(280);
	return applyFilter(store, filter);
}

export async function getThread(id: string): Promise<Thread | null> {
	await delay(100);
	return store.find((t) => t.id === id) ?? null;
}

export async function markRead(id: string, unread = false): Promise<void> {
	await delay(120);
	store = store.map((t) => (t.id === id ? { ...t, unread } : t));
}

export async function toggleStar(id: string): Promise<void> {
	await delay(120);
	store = store.map((t) =>
		t.id === id ? { ...t, starred: !t.starred } : t,
	);
}

export async function moveThread(id: string, folder: Folder): Promise<void> {
	await delay(180);
	store = store.map((t) => (t.id === id ? { ...t, folder } : t));
}

export async function summarizeThread(id: string): Promise<string> {
	await delay(900);
	const t = store.find((x) => x.id === id);
	if (!t) throw new Error("Thread not found");
	const summary = generateSummary(t);
	store = store.map((x) => (x.id === id ? { ...x, aiSummary: summary } : x));
	return summary;
}

function generateSummary(t: Thread): string {
	// Very lightweight rule-based "AI" — picks key sentences.
	const allBody = t.messages
		.map((m) => `${m.from.name}: ${m.body}`)
		.join("\n");
	const firstLines = allBody
		.split("\n")
		.filter((l) => l.trim().length > 30)
		.slice(0, 2)
		.join(" ")
		.replace(/\s+/g, " ");
	if (t.subject.toLowerCase().includes("scope")) {
		return "Priya needs your sign-off on two open questions: include the new pricing tier in launch, and ship the onboarding revamp in v1 vs v2. Decision needed by EOD Tuesday.";
	}
	if (t.subject.toLowerCase().includes("recap")) {
		return "Sprint planning produced 4 decisions with owners: Priya locks scope by Friday, Aisha runs design review next Wednesday, Devon updates pricing page Thursday, Marcus shares roadmap deck Friday.";
	}
	if (t.subject.toLowerCase().includes("pricing")) {
		return "Marcus needs final pricing-tier copy by EOD Thursday. He'll send the feature matrix Tuesday. You need to sign off on positioning before the design review.";
	}
	if (t.subject.toLowerCase().includes("demo")) {
		return "Clara at Acme wants a follow-up next week (Tuesday or Wednesday afternoon) to bring their VP of Operations into a deeper demo focused on meeting-to-task flow.";
	}
	if (t.subject.toLowerCase().includes("invoice")) {
		return "Payment receipt for $480.00 on the Team plan. No action needed. Next invoice scheduled for the 1st of next month.";
	}
	return firstLines.slice(0, 220) + "…";
}

export async function sendDraft(draft: ComposeDraft): Promise<Thread> {
	await delay(700);
	const id = `th_${Math.random().toString(36).slice(2, 9)}`;
	const toEntries: Participant[] = draft.to
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean)
		.map((email) => ({
			name: email.split("@")[0],
			email,
		}));
	const sent = new Date().toISOString();
	const m = msg(id, ME, toEntries, draft.subject, draft.body, sent);
	const t: Thread = {
		id,
		subject: draft.subject || "(no subject)",
		snippet: m.snippet,
		participants: [ME, ...toEntries],
		messages: [m],
		folder: "sent",
		labels: [],
		unread: false,
		starred: false,
		updatedAt: sent,
	};
	store = [t, ...store];
	return t;
}

export async function deleteThread(id: string): Promise<void> {
	await delay(200);
	store = store.map((t) => (t.id === id ? { ...t, folder: "trash" } : t));
}

export async function archiveThread(id: string): Promise<void> {
	await delay(200);
	store = store.map((t) => (t.id === id ? { ...t, folder: "archive" } : t));
}

/** Folder counts for the rail. */
export async function getFolderCounts(): Promise<Record<Folder, number>> {
	await delay(80);
	const counts: Record<Folder, number> = {
		inbox: 0,
		starred: 0,
		sent: 0,
		drafts: 0,
		archive: 0,
		trash: 0,
	};
	for (const t of store) {
		if (t.folder !== "trash" && t.starred) counts.starred += 1;
		counts[t.folder] += 1;
	}
	return counts;
}
