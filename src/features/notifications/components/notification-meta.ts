import {
	AtSign,
	Bell,
	ClipboardCheck,
	type LucideIcon,
	Sparkles,
	Video,
} from "lucide-react";

import type { NotificationKind } from "../types/notification";

export type KindTone = "ai" | "indigo" | "emerald" | "amber" | "rose" | "neutral";

export type KindMeta = {
	icon: LucideIcon;
	tone: KindTone;
};

export const KIND_META: Record<NotificationKind, KindMeta> = {
	task: { icon: ClipboardCheck, tone: "emerald" },
	meeting: { icon: Video, tone: "indigo" },
	decision: { icon: Sparkles, tone: "ai" },
	mention: { icon: AtSign, tone: "amber" },
	system: { icon: Bell, tone: "neutral" },
};

export function toneClasses(tone: KindTone): string {
	switch (tone) {
		case "ai":
			return "bg-ai-tint text-ai ring-ai/25";
		case "indigo":
			return "bg-[oklch(0.55_0.2_285/0.1)] text-[oklch(0.55_0.2_285)] ring-[oklch(0.55_0.2_285/0.2)]";
		case "emerald":
			return "bg-[oklch(0.65_0.16_162/0.1)] text-success ring-success/20";
		case "amber":
			return "bg-[oklch(0.82_0.15_75/0.14)] text-warning ring-warning/20";
		case "rose":
			return "bg-[oklch(0.68_0.2_27/0.1)] text-destructive ring-destructive/20";
		case "neutral":
		default:
			return "bg-surface-muted text-muted-foreground ring-border";
	}
}

/**
 * Short, locale-aware relative time. Matches the style used in Gmail rows.
 */
export function shortTime(iso: string, locale: string): string {
	const then = new Date(iso);
	if (Number.isNaN(then.getTime())) return "";
	const now = Date.now();
	const diffMs = Math.max(0, now - then.getTime());
	const mins = Math.floor(diffMs / 60_000);
	if (mins < 1) return "now";
	if (mins < 60) return `${mins}m`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours}h`;
	const days = Math.floor(hours / 24);
	if (days < 7) {
		try {
			return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
				then,
			);
		} catch {
			return then.toDateString().slice(0, 3);
		}
	}
	try {
		return new Intl.DateTimeFormat(locale, {
			month: "short",
			day: "numeric",
		}).format(then);
	} catch {
		return then.toLocaleDateString();
	}
}
