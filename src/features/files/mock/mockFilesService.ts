/**
 * Mock files service.
 *
 * In-memory only. Lives at the module level so different components see the
 * same data within a single page session, but everything is wiped on refresh.
 *
 * Single point of change when the real backend ships — every consumer reads
 * from this module via the typed methods below.
 */
import type {
	FileItem,
	FileKind,
	FilesFilter,
	FileOwner,
} from "../types/file";

const OWNERS: FileOwner[] = [
	{ id: "u_priya", name: "Priya Raman", email: "priya@northwave.io" },
	{ id: "u_marcus", name: "Marcus Vega", email: "marcus@northwave.io" },
	{ id: "u_aisha", name: "Aisha Karim", email: "aisha@northwave.io" },
	{ id: "u_devon", name: "Devon Park", email: "devon@northwave.io" },
	{ id: "u_alex", name: "Alex Morgan", email: "demo@sprintifai.com" },
];

function nowOffset(daysAgo: number, hoursAgo = 0): string {
	const d = new Date();
	d.setDate(d.getDate() - daysAgo);
	d.setHours(d.getHours() - hoursAgo);
	return d.toISOString();
}

const SEED: FileItem[] = [
	{
		id: "f_001",
		name: "Sprint planning — transcript",
		kind: "transcript",
		sizeBytes: 284_410,
		createdAt: nowOffset(0, 2),
		updatedAt: nowOffset(0, 2),
		owner: OWNERS[0],
		tags: ["Q3 launch", "Engineering"],
		fromMeeting: true,
		meetingTitle: "Sprint planning",
	},
	{
		id: "f_002",
		name: "Sprint planning — recording",
		kind: "recording",
		sizeBytes: 184_000_000,
		createdAt: nowOffset(0, 2),
		updatedAt: nowOffset(0, 2),
		owner: OWNERS[0],
		tags: ["Q3 launch"],
		fromMeeting: true,
		meetingTitle: "Sprint planning",
	},
	{
		id: "f_003",
		name: "Roadmap deck — Q3",
		kind: "deck",
		sizeBytes: 4_200_000,
		createdAt: nowOffset(1),
		updatedAt: nowOffset(0, 5),
		owner: OWNERS[1],
		tags: ["Leadership", "Q3 launch"],
	},
	{
		id: "f_004",
		name: "Onboarding revamp — brief",
		kind: "note",
		sizeBytes: 112_640,
		createdAt: nowOffset(2),
		updatedAt: nowOffset(1, 4),
		owner: OWNERS[2],
		tags: ["Onboarding", "Design"],
	},
	{
		id: "f_005",
		name: "Launch checklist",
		kind: "task",
		sizeBytes: 38_912,
		createdAt: nowOffset(3),
		updatedAt: nowOffset(0, 12),
		owner: OWNERS[3],
		tags: ["Q3 launch"],
	},
	{
		id: "f_006",
		name: "Customer interviews — recap",
		kind: "pdf",
		sizeBytes: 1_843_200,
		createdAt: nowOffset(5),
		updatedAt: nowOffset(4),
		owner: OWNERS[2],
		tags: ["Research"],
	},
	{
		id: "f_007",
		name: "Design review — recording",
		kind: "recording",
		sizeBytes: 256_000_000,
		createdAt: nowOffset(4),
		updatedAt: nowOffset(4),
		owner: OWNERS[0],
		tags: ["Design", "Onboarding"],
		fromMeeting: true,
		meetingTitle: "Design review",
	},
	{
		id: "f_008",
		name: "Pricing tier — proposal",
		kind: "doc",
		sizeBytes: 88_064,
		createdAt: nowOffset(6),
		updatedAt: nowOffset(2),
		owner: OWNERS[1],
		tags: ["Pricing", "Growth"],
	},
	{
		id: "f_009",
		name: "Mobile launch — hero",
		kind: "image",
		sizeBytes: 2_457_600,
		createdAt: nowOffset(7),
		updatedAt: nowOffset(7),
		owner: OWNERS[3],
		tags: ["Brand"],
	},
	{
		id: "f_010",
		name: "Standup — Mon transcript",
		kind: "transcript",
		sizeBytes: 92_160,
		createdAt: nowOffset(7, 4),
		updatedAt: nowOffset(7, 4),
		owner: OWNERS[4],
		tags: ["Engineering"],
		fromMeeting: true,
		meetingTitle: "Mon standup",
	},
	{
		id: "f_011",
		name: "Action items — Q3 kickoff",
		kind: "task",
		sizeBytes: 24_576,
		createdAt: nowOffset(8),
		updatedAt: nowOffset(8),
		owner: OWNERS[4],
		tags: ["Q3 launch"],
	},
	{
		id: "f_012",
		name: "Demo recording — Acme prospect",
		kind: "video",
		sizeBytes: 412_000_000,
		createdAt: nowOffset(10),
		updatedAt: nowOffset(9),
		owner: OWNERS[1],
		tags: ["Sales"],
	},
];

let store: FileItem[] = [...SEED];

function delay(ms: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function applyFilter(items: FileItem[], filter: FilesFilter): FileItem[] {
	let out = items.slice();

	// Category gate
	switch (filter.category) {
		case "recent":
			out = out
				.slice()
				.sort((a, b) =>
					a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0,
				)
				.slice(0, 8);
			break;
		case "recordings":
			out = out.filter((f) => f.kind === "recording" || f.kind === "video");
			break;
		case "tasks":
			out = out.filter((f) => f.kind === "task");
			break;
		case "notes":
			out = out.filter((f) => f.kind === "note");
			break;
		case "all":
		default:
			break;
	}

	// Kind filter (multi-select)
	if (filter.kinds.length > 0) {
		const kindSet = new Set(filter.kinds);
		out = out.filter((f) => kindSet.has(f.kind));
	}

	// Text search across name, tags, owner, meeting
	const q = filter.query.trim().toLowerCase();
	if (q.length > 0) {
		out = out.filter((f) => {
			const haystack = [
				f.name,
				f.owner.name,
				f.owner.email,
				f.meetingTitle ?? "",
				...f.tags,
			]
				.join(" ")
				.toLowerCase();
			return haystack.includes(q);
		});
	}

	// Sort — but only when category isn't "recent" (which has its own sort).
	if (filter.category !== "recent") {
		out.sort((a, b) => {
			const dir = filter.sortDirection === "asc" ? 1 : -1;
			switch (filter.sortField) {
				case "name":
					return a.name.localeCompare(b.name) * dir;
				case "size":
					return (a.sizeBytes - b.sizeBytes) * dir;
				case "updatedAt":
				default:
					return (
						(a.updatedAt < b.updatedAt
							? -1
							: a.updatedAt > b.updatedAt
								? 1
								: 0) * dir
					);
			}
		});
	}

	return out;
}

export async function listFiles(filter: FilesFilter): Promise<FileItem[]> {
	await delay(350);
	return applyFilter(store, filter);
}

export async function getFile(id: string): Promise<FileItem | null> {
	await delay(120);
	return store.find((f) => f.id === id) ?? null;
}

export async function uploadFile(input: {
	name: string;
	sizeBytes: number;
	kind: FileKind;
	owner: FileOwner;
}): Promise<FileItem> {
	await delay(1200);
	const id = `f_${Math.random().toString(36).slice(2, 10)}`;
	const now = new Date().toISOString();
	const created: FileItem = {
		id,
		name: input.name,
		kind: input.kind,
		sizeBytes: input.sizeBytes,
		createdAt: now,
		updatedAt: now,
		owner: input.owner,
		tags: [],
	};
	store = [created, ...store];
	return created;
}

export async function deleteFile(id: string): Promise<void> {
	await delay(300);
	store = store.filter((f) => f.id !== id);
}

export async function renameFile(
	id: string,
	name: string,
): Promise<FileItem | null> {
	await delay(280);
	let updated: FileItem | null = null;
	store = store.map((f) => {
		if (f.id !== id) return f;
		updated = { ...f, name, updatedAt: new Date().toISOString() };
		return updated;
	});
	return updated;
}

/** Default demo owner — used when an upload happens without auth context. */
export const DEMO_OWNER: FileOwner = OWNERS[4];

/** Inferring a kind from a filename extension. */
export function inferKindFromName(name: string): FileKind {
	const ext = name.split(".").pop()?.toLowerCase() ?? "";
	if (["pdf"].includes(ext)) return "pdf";
	if (["doc", "docx", "rtf"].includes(ext)) return "doc";
	if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "image";
	if (["mp4", "mov", "webm", "mkv"].includes(ext)) return "video";
	if (["mp3", "wav", "m4a", "ogg"].includes(ext)) return "audio";
	if (["md", "txt"].includes(ext)) return "note";
	if (["ppt", "pptx", "key"].includes(ext)) return "deck";
	return "other";
}
