import { memo } from "react";

import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────────
 * HeroTrustAvatars — 5 squircle avatars with deterministic SVG initials.
 *
 * No stock photos, no Lucide egg icons. Each avatar is a tiny squircle with
 * a tinted gradient background and the person's initials in Geist semibold.
 * The roster is intentionally diverse and not a list of "Jane Doe" tells.
 * ──────────────────────────────────────────────────────────────────────── */

type Person = {
	initials: string;
	from: string;
	to: string;
	fg: string;
};

const ROSTER: Person[] = [
	{
		initials: "PR",
		from: "oklch(0.74 0.16 285)",
		to: "oklch(0.62 0.19 245)",
		fg: "oklch(0.98 0.01 250)",
	},
	{
		initials: "MV",
		from: "oklch(0.78 0.13 162)",
		to: "oklch(0.62 0.16 162)",
		fg: "oklch(0.98 0.01 160)",
	},
	{
		initials: "AK",
		from: "oklch(0.82 0.14 75)",
		to: "oklch(0.7 0.16 50)",
		fg: "oklch(0.18 0.02 60)",
	},
	{
		initials: "DT",
		from: "oklch(0.74 0.16 25)",
		to: "oklch(0.6 0.18 15)",
		fg: "oklch(0.98 0.01 20)",
	},
	{
		initials: "JN",
		from: "oklch(0.72 0.13 220)",
		to: "oklch(0.55 0.15 240)",
		fg: "oklch(0.98 0.01 230)",
	},
];

export const HeroTrustAvatars = memo(function HeroTrustAvatars() {
	return (
		<div className="flex -space-x-2.5 rtl:space-x-reverse" aria-hidden="true">
			{ROSTER.map((p, i) => (
				<Squircle key={p.initials} person={p} index={i} />
			))}
		</div>
	);
});

function Squircle({ person, index }: { person: Person; index: number }) {
	// Each avatar has a slight delay so the cluster reads as composed, not mounted
	const delay = `${index * 70}ms`;
	const gradientId = `avatar-grad-${person.initials.toLowerCase()}`;
	return (
		<span
			className={cn(
				"relative inline-grid place-items-center size-8",
				"ring-2 ring-background rounded-[10px]",
				"shadow-[0_2px_6px_-2px_oklch(0_0_0/0.12)]",
				"motion-safe:animate-[avatar-pop_0.6s_cubic-bezier(0.16,1,0.3,1)_both]",
			)}
			style={
				{
					animationDelay: delay,
					zIndex: 10 - index,
				} as React.CSSProperties
			}
		>
			<svg
				width="32"
				height="32"
				viewBox="0 0 32 32"
				className="absolute inset-0 rounded-[10px] overflow-hidden"
				aria-hidden="true"
			>
				<defs>
					<linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor={person.from} />
						<stop offset="100%" stopColor={person.to} />
					</linearGradient>
				</defs>
				<rect
					width="32"
					height="32"
					rx="10"
					ry="10"
					fill={`url(#${gradientId})`}
				/>
			</svg>
			<span
				className="relative text-[0.625rem] font-semibold tracking-tight"
				style={{ color: person.fg }}
			>
				{person.initials}
			</span>
		</span>
	);
}
