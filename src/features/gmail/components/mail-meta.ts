import type { LabelTone } from "../types/mail";

export function initials(name: string): string {
	return name
		.split(" ")
		.map((w) => w[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

/**
 * Short, locale-aware "when": "2m", "3h", "Mon", "Jul 14".
 * Compact like the real Gmail row time stamp.
 */
export function shortTime(iso: string, locale: string): string {
	const then = new Date(iso);
	if (Number.isNaN(then.getTime())) return "";
	const now = Date.now();
	const diffMs = Math.max(0, now - then.getTime());
	const mins = Math.floor(diffMs / 60000);
	if (mins < 60) return `${Math.max(1, mins)}m`;
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

export function fullTime(iso: string, locale: string): string {
	const then = new Date(iso);
	if (Number.isNaN(then.getTime())) return "";
	try {
		return new Intl.DateTimeFormat(locale, {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(then);
	} catch {
		return then.toLocaleString();
	}
}

export function labelToneClass(tone: LabelTone): string {
	switch (tone) {
		case "ai":
			return "bg-ai-tint text-ai ring-ai/25";
		case "indigo":
			return "bg-[oklch(0.55_0.2_285/0.12)] text-[oklch(0.55_0.2_285)] ring-[oklch(0.55_0.2_285/0.25)]";
		case "emerald":
			return "bg-[oklch(0.65_0.16_162/0.12)] text-success ring-success/25";
		case "amber":
			return "bg-[oklch(0.82_0.15_75/0.18)] text-warning ring-warning/25";
		case "rose":
			return "bg-[oklch(0.68_0.2_27/0.12)] text-destructive ring-destructive/25";
		case "neutral":
		default:
			return "bg-surface-muted text-muted-foreground ring-border";
	}
}
