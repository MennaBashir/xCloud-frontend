import {
	type LucideIcon,
	FileText,
	File as FileIcon,
	Image as ImageIcon,
	Video,
	Music,
	Mic,
	Presentation,
	NotebookPen,
	ClipboardCheck,
	FileType2,
} from "lucide-react";

import type { FileKind } from "../types/file";

export type KindTone =
	| "ai"
	| "indigo"
	| "emerald"
	| "amber"
	| "rose"
	| "neutral"
	| "sky";

export type KindMeta = {
	icon: LucideIcon;
	tone: KindTone;
	labelKey: string;
};

export const KIND_META: Record<FileKind, KindMeta> = {
	pdf: { icon: FileType2, tone: "rose", labelKey: "kinds.pdf" },
	doc: { icon: FileText, tone: "indigo", labelKey: "kinds.doc" },
	image: { icon: ImageIcon, tone: "amber", labelKey: "kinds.image" },
	video: { icon: Video, tone: "sky", labelKey: "kinds.video" },
	audio: { icon: Music, tone: "emerald", labelKey: "kinds.audio" },
	recording: { icon: Mic, tone: "indigo", labelKey: "kinds.recording" },
	transcript: { icon: FileText, tone: "ai", labelKey: "kinds.transcript" },
	deck: { icon: Presentation, tone: "amber", labelKey: "kinds.deck" },
	note: { icon: NotebookPen, tone: "emerald", labelKey: "kinds.note" },
	task: { icon: ClipboardCheck, tone: "ai", labelKey: "kinds.task" },
	other: { icon: FileIcon, tone: "neutral", labelKey: "kinds.other" },
};

export function toneClasses(tone: KindTone): string {
	switch (tone) {
		case "ai":
			return "bg-ai-tint text-ai ring-ai/20";
		case "indigo":
			return "bg-[oklch(0.55_0.2_285/0.12)] text-[oklch(0.55_0.2_285)] ring-[oklch(0.55_0.2_285/0.25)]";
		case "emerald":
			return "bg-[oklch(0.65_0.16_162/0.12)] text-success ring-success/25";
		case "amber":
			return "bg-[oklch(0.82_0.15_75/0.18)] text-warning ring-warning/25";
		case "rose":
			return "bg-[oklch(0.68_0.2_27/0.12)] text-destructive ring-destructive/25";
		case "sky":
			return "bg-[oklch(0.62_0.19_245/0.12)] text-ai ring-ai/25";
		case "neutral":
		default:
			return "bg-surface-muted text-muted-foreground ring-border";
	}
}

export function formatBytes(bytes: number): {
	value: string;
	unit: "B" | "KB" | "MB" | "GB";
} {
	if (bytes < 1024) return { value: String(bytes), unit: "B" };
	if (bytes < 1024 * 1024)
		return { value: (bytes / 1024).toFixed(0), unit: "KB" };
	if (bytes < 1024 * 1024 * 1024)
		return { value: (bytes / (1024 * 1024)).toFixed(1), unit: "MB" };
	return { value: (bytes / (1024 * 1024 * 1024)).toFixed(2), unit: "GB" };
}

export function relativeTime(
	iso: string,
	t: (key: string, opts?: Record<string, unknown>) => string,
): string {
	const now = Date.now();
	const then = new Date(iso).getTime();
	const diffMs = Math.max(0, now - then);
	const mins = Math.floor(diffMs / (60 * 1000));
	if (mins < 1) return t("time.justNow");
	if (mins < 60) return t("time.minutesAgo", { count: mins });
	const hours = Math.floor(mins / 60);
	if (hours < 24) return t("time.hoursAgo", { count: hours });
	const days = Math.floor(hours / 24);
	return t("time.daysAgo", { count: days });
}

/**
 * Locale-aware absolute date for tooltips / preview pane.
 */
export function formatDate(iso: string, locale: string): string {
	try {
		return new Intl.DateTimeFormat(locale, {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(iso));
	} catch {
		return new Date(iso).toLocaleString();
	}
}
