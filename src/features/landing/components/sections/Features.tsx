import { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import {
	CalendarDays,
	Check,
	CircleCheck,
	FolderClosed,
	type LucideIcon,
	Inbox,
	Search,
	Sparkles,
	Video,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { EyebrowTag } from "@/shared/components/EyebrowTag";

/* ──────────────────────────────────────────────────────────────────────────
 * Features section
 *
 * Top: hero feature (Meetings) — wide 2-column zig-zag with rich mockup
 * Bottom: 2x2 asymmetric bento (Chat AI, Calendar, Files, Inbox), each card
 *         is Double-Bezel + per-card perpetual micro-motion. Memo'd leaves.
 * ──────────────────────────────────────────────────────────────────────── */

export function Features() {
	const { t } = useTranslation("landing");

	return (
		<section
			id="features"
			className="relative py-20 sm:py-32 lg:py-40 scroll-mt-24"
		>
			<div className="container mx-auto px-4 sm:px-6">
				<header className="flex flex-col items-center text-center gap-4 max-w-[760px] mx-auto mb-12 sm:mb-24">
					<EyebrowTag>{t("features.eyebrow")}</EyebrowTag>
					<h2 className="font-semibold tracking-tight leading-[1.1] text-[1.75rem] xs:text-[2rem] sm:text-[2.5rem] lg:text-[3.25rem] text-foreground [text-wrap:balance]">
						{t("features.sectionTitle")}
					</h2>
					<p className="text-[1rem] sm:text-[1.0625rem] leading-relaxed text-muted-foreground max-w-[60ch]">
						{t("features.sectionSubtitle")}
					</p>
				</header>

				{/* Hero feature — Meetings */}
				<HeroFeatureRow />

				{/* Bento — 2x2 asymmetric */}
				<div className="mt-20 sm:mt-32 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
					<BentoFeatureCard
						eyebrow={t("features.chat.eyebrow")}
						title={t("features.chat.title")}
						description={t("features.chat.description")}
						icon={Sparkles}
						tone="ai"
						visual={<ChatVisual />}
						className="sm:col-span-2 lg:col-span-1"
					/>
					<BentoFeatureCard
						eyebrow={t("features.calendar.eyebrow")}
						title={t("features.calendar.title")}
						description={t("features.calendar.description")}
						icon={CalendarDays}
						tone="emerald"
						visual={<CalendarVisual />}
					/>
					<BentoFeatureCard
						eyebrow={t("features.files.eyebrow")}
						title={t("features.files.title")}
						description={t("features.files.description")}
						icon={FolderClosed}
						tone="amber"
						visual={<FilesVisual />}
					/>
					<BentoFeatureCard
						eyebrow={t("features.gmail.eyebrow")}
						title={t("features.gmail.title")}
						description={t("features.gmail.description")}
						icon={Inbox}
						tone="rose"
						visual={<GmailVisual />}
					/>
				</div>
			</div>
		</section>
	);
}

/* ════════════════════════════════════════════════════════════════════════════
 * Hero feature row — Meetings (wide 2-col zig-zag)
 * ════════════════════════════════════════════════════════════════════════════ */

function HeroFeatureRow() {
	const { t } = useTranslation("landing");
	const bullets = [
		t("features.meeting.bullets.a"),
		t("features.meeting.bullets.b"),
		t("features.meeting.bullets.c"),
	];

	return (
		<motion.article
			initial={{ y: 32, opacity: 0, filter: "blur(8px)" }}
			whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
			className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] items-center gap-10 sm:gap-14"
		>
			{/* Copy */}
			<div className="flex flex-col gap-5 max-w-[520px]">
				<div className="inline-flex items-center gap-2 self-start">
					<span className="inline-flex items-center justify-center size-7 rounded-[var(--radius-sm)] bg-[oklch(0.55_0.2_285/0.12)] text-[oklch(0.55_0.2_285)] ring-1 ring-inset ring-[oklch(0.55_0.2_285/0.25)]">
						<Video className="size-3.5" strokeWidth={1.7} />
					</span>
					<span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
						{t("features.meeting.eyebrow")}
					</span>
				</div>

				<h3 className="font-semibold tracking-tight leading-[1.1] text-[1.5rem] xs:text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] text-foreground [text-wrap:balance]">
					{t("features.meeting.title")}
				</h3>

				<p className="text-[1rem] sm:text-[1.0625rem] leading-relaxed text-muted-foreground">
					{t("features.meeting.description")}
				</p>

				<ul className="flex flex-col gap-2.5 mt-2">
					{bullets.map((b) => (
						<li
							key={b}
							className="flex items-start gap-2.5 text-[0.9375rem] text-foreground"
						>
							<span className="mt-0.5 grid size-5 place-items-center rounded-full shrink-0 bg-foreground/5 text-foreground">
								<Check className="size-3" strokeWidth={2} />
							</span>
							<span className="leading-relaxed">{b}</span>
						</li>
					))}
				</ul>
			</div>

			{/* Visual — Double-Bezel mockup */}
			<DoubleBezel className="lg:[&]:scale-[1.02]">
				<MeetingHeroVisual />
			</DoubleBezel>
		</motion.article>
	);
}

/* ════════════════════════════════════════════════════════════════════════════
 * Double-Bezel wrapper — used by all feature visuals
 * ════════════════════════════════════════════════════════════════════════════ */

function DoubleBezel({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"relative rounded-[2rem] p-1.5 sm:p-2",
				"bg-foreground/[0.035] ring-1 ring-inset ring-border",
				"shadow-[0_1px_2px_oklch(0_0_0/0.04),0_32px_64px_-32px_oklch(0_0_0/0.16)]",
				className,
			)}
		>
			<div
				className={cn(
					"rounded-[calc(2rem-0.5rem)] border border-border bg-card overflow-hidden",
					"shadow-[inset_0_1px_0_oklch(1_0_0/0.06)]",
					"min-h-[320px] sm:min-h-[400px]",
				)}
			>
				{children}
			</div>
		</div>
	);
}

/* ════════════════════════════════════════════════════════════════════════════
 * MeetingHeroVisual — the hero feature mockup
 * ════════════════════════════════════════════════════════════════════════════ */

function MeetingHeroVisual() {
	return (
		<div className="p-4 sm:p-6 h-full flex flex-col gap-4">
			{/* Live badge */}
			<div className="flex items-center justify-between">
				<div className="inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
					<span className="relative grid size-1.5 place-items-center">
						<span
							aria-hidden="true"
							className="absolute inset-0 rounded-full bg-destructive/55 animate-ping"
						/>
						<span className="relative size-1.5 rounded-full bg-destructive" />
					</span>
					<span>Live · Sprint planning</span>
				</div>
				<span className="text-[0.6875rem] text-muted-foreground font-mono">
					12:47
				</span>
			</div>

			{/* Video tiles */}
			<div className="grid grid-cols-2 gap-2.5">
				{[0, 1, 2, 3].map((i) => (
					<div
						key={i}
						className="aspect-[4/3] rounded-[var(--radius-md)] bg-surface-muted ring-1 ring-inset ring-border relative overflow-hidden"
						style={{
							backgroundImage:
								"radial-gradient(at " +
								[28, 72, 38, 62][i] +
								"% " +
								[32, 60, 70, 38][i] +
								"%, oklch(0.55 0.2 " +
								[285, 245, 162, 25][i] +
								" / 0.42) 0px, transparent 60%)",
						}}
					>
						<span className="absolute bottom-1.5 start-1.5 inline-flex items-center gap-1.5 rounded-full bg-black/60 text-white px-1.5 py-0.5 text-[0.625rem] font-medium">
							{["Priya", "Marcus", "Aisha", "Devon"][i]}
						</span>
						{i === 0 ? (
							<span className="absolute top-1.5 end-1.5 inline-flex items-center gap-1 rounded-full bg-success/85 text-white px-1.5 py-0.5 text-[0.5625rem] font-medium">
								Speaking
							</span>
						) : null}
					</div>
				))}
			</div>

			{/* Live transcript */}
			<div className="mt-1 rounded-[var(--radius-md)] border border-border bg-surface-muted/60 px-3.5 py-3 flex items-start gap-2">
				<Sparkles
					className="size-3.5 mt-0.5 text-ai shrink-0 ambient-pulse"
					strokeWidth={1.7}
				/>
				<p className="text-[0.875rem] leading-relaxed text-foreground">
					<span className="text-muted-foreground">Priya:</span>{" "}
					Let&apos;s lock the launch scope before Friday and assign the
					design review to Aisha.
				</p>
			</div>

			{/* AI summary preview strip */}
			<div className="mt-auto grid grid-cols-3 gap-2">
				{[
					{ label: "Decisions", value: "3" },
					{ label: "Action items", value: "7" },
					{ label: "Owners", value: "4" },
				].map((m) => (
					<div
						key={m.label}
						className="rounded-[var(--radius-md)] border border-border bg-surface-muted/40 px-3 py-2.5"
					>
						<div className="text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground font-medium">
							{m.label}
						</div>
						<div className="mt-0.5 text-[1.125rem] font-semibold text-foreground tabular-nums">
							{m.value}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

/* ════════════════════════════════════════════════════════════════════════════
 * BentoFeatureCard — 2x2 grid card with Double-Bezel + spotlight + visual
 * ════════════════════════════════════════════════════════════════════════════ */

type Tone = "ai" | "emerald" | "amber" | "rose";

const TONE_CLASS: Record<Tone, string> = {
	ai: "bg-ai-tint text-ai ring-ai/25",
	emerald:
		"bg-[oklch(0.65_0.16_162/0.12)] text-success ring-success/25",
	amber:
		"bg-[oklch(0.82_0.15_75/0.16)] text-warning ring-warning/25",
	rose:
		"bg-[oklch(0.68_0.2_27/0.12)] text-destructive ring-destructive/25",
};

const BentoFeatureCard = memo(function BentoFeatureCard({
	eyebrow,
	title,
	description,
	icon: Icon,
	tone,
	visual,
	className,
}: {
	eyebrow: string;
	title: string;
	description: string;
	icon: LucideIcon;
	tone: Tone;
	visual: React.ReactNode;
	className?: string;
}) {
	const shellRef = useRef<HTMLDivElement>(null);

	const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		if (event.pointerType !== "mouse") return;
		const el = shellRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;
		el.style.setProperty("--spot-x", `${x}%`);
		el.style.setProperty("--spot-y", `${y}%`);
	};

	return (
		<motion.article
			initial={{ y: 28, opacity: 0, filter: "blur(8px)" }}
			whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
			className={cn("flex flex-col gap-4", className)}
		>
			<div
				ref={shellRef}
				onPointerMove={handlePointerMove}
				className={cn(
					"spotlight-border relative rounded-[2rem] p-1.5",
					"bg-foreground/[0.035] ring-1 ring-inset ring-border",
					"transition-shadow duration-[var(--duration-base)] ease-[cubic-bezier(0.32,0.72,0,1)]",
					"shadow-[0_1px_2px_oklch(0_0_0/0.03),0_20px_40px_-22px_oklch(0_0_0/0.12)]",
					"hover:shadow-[0_1px_2px_oklch(0_0_0/0.04),0_28px_56px_-22px_oklch(0_0_0/0.18)]",
				)}
			>
				<div
					className={cn(
						"rounded-[calc(2rem-0.375rem)] border border-border/70 bg-card overflow-hidden",
						"shadow-[inset_0_1px_0_oklch(1_0_0/0.05)]",
						"min-h-[280px]",
					)}
				>
					<div className="p-5 sm:p-6 pb-3 flex items-center gap-2">
						<span
							className={cn(
								"grid size-7 place-items-center rounded-[var(--radius-sm)] ring-1 ring-inset",
								TONE_CLASS[tone],
							)}
						>
							<Icon className="size-3.5" strokeWidth={1.7} />
						</span>
						<span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
							{eyebrow}
						</span>
					</div>
					{visual}
				</div>
			</div>

			<div className="px-1 flex flex-col gap-1.5">
				<h3 className="font-semibold tracking-tight text-[1.0625rem] text-foreground [text-wrap:balance]">
					{title}
				</h3>
				<p className="text-[0.875rem] text-muted-foreground leading-relaxed max-w-[44ch]">
					{description}
				</p>
			</div>
		</motion.article>
	);
});

/* ════════════════════════════════════════════════════════════════════════════
 * Per-card perpetual visuals — each is memoised
 * ════════════════════════════════════════════════════════════════════════════ */

/* Chat — cursor blink + cited answer */
const ChatVisual = memo(function ChatVisual() {
	return (
		<div className="px-5 sm:px-6 pb-5 sm:pb-6 flex flex-col gap-3">
			<div className="flex items-start gap-3">
				<div className="size-7 rounded-full bg-surface-muted shrink-0 ring-1 ring-inset ring-border" />
				<div className="rounded-2xl bg-surface-muted/60 px-3.5 py-2.5 text-[0.875rem]">
					What did we agree on for the Q3 launch?
				</div>
			</div>
			<div className="flex items-start gap-3 flex-row-reverse">
				<div className="size-7 rounded-full bg-ai-tint text-ai grid place-items-center shrink-0 ring-1 ring-inset ring-ai/20 ambient-pulse">
					<Sparkles className="size-3.5" strokeWidth={1.7} />
				</div>
				<div className="rounded-2xl bg-ai-tint text-foreground px-3.5 py-3 text-[0.875rem] leading-relaxed max-w-[80%]">
					Locked scope by Friday. Owner: Priya.
					<span
						aria-hidden="true"
						className="inline-block w-[2px] h-3.5 ms-0.5 bg-ai animate-pulse align-middle"
						style={{ animationDuration: "1.1s" }}
					/>
					<div className="mt-2 pt-2 border-t border-ai/15 text-[0.75rem] text-muted-foreground">
						Source: Sprint planning · 12:47
					</div>
				</div>
			</div>
		</div>
	);
});

/* Calendar — pulsing "now" indicator */
const CalendarVisual = memo(function CalendarVisual() {
	const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
	return (
		<div className="px-5 sm:px-6 pb-5 sm:pb-6">
			<div className="grid grid-cols-5 gap-1.5 sm:gap-2 h-full">
				{days.map((day, i) => (
					<div key={day} className="flex flex-col gap-2 min-w-0">
						<div className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground text-center">
							{day}
						</div>
						<div className="flex-1 rounded-[var(--radius-sm)] border border-border bg-surface-muted/40 p-1 sm:p-1.5 flex flex-col gap-1 min-w-0 min-h-[120px]">
							{i === 1 ? (
								<div className="rounded-[var(--radius-xs)] bg-success/15 border border-success/30 px-1 sm:px-1.5 py-1 text-[0.625rem] sm:text-[0.6875rem] text-success font-medium truncate">
									Standup
								</div>
							) : null}
							{i === 2 ? (
								<>
									<div className="relative rounded-[var(--radius-xs)] bg-ai-tint border border-ai/30 px-1 sm:px-1.5 py-1 text-[0.625rem] sm:text-[0.6875rem] text-ai font-medium truncate">
										Sprint planning
										<span
											aria-hidden="true"
											className="absolute -top-1 -end-1 grid size-2 place-items-center"
										>
											<span className="absolute inset-0 rounded-full bg-ai/60 animate-ping" />
											<span className="relative size-2 rounded-full bg-ai" />
										</span>
									</div>
									<div className="rounded-[var(--radius-xs)] bg-success/15 border border-success/30 px-1 sm:px-1.5 py-1 text-[0.625rem] sm:text-[0.6875rem] text-success font-medium truncate">
										Standup
									</div>
								</>
							) : null}
							{i === 4 ? (
								<div className="rounded-[var(--radius-xs)] bg-[oklch(0.82_0.15_75/0.18)] border border-warning/30 px-1 sm:px-1.5 py-1 text-[0.625rem] sm:text-[0.6875rem] text-warning font-medium truncate">
									Launch scope
								</div>
							) : null}
						</div>
					</div>
				))}
			</div>
		</div>
	);
});

/* Files — shimmer line across the active row */
const FilesVisual = memo(function FilesVisual() {
	const rows = [
		{ name: "Sprint planning · transcript", type: "TXT", active: true },
		{ name: "Roadmap deck Q3", type: "PDF" },
		{ name: "Onboarding revamp brief", type: "MD" },
		{ name: "Customer interviews recap", type: "PDF" },
	];
	return (
		<div className="px-5 sm:px-6 pb-5 sm:pb-6 flex flex-col gap-2">
			<div className="hidden xs:flex items-center gap-2 rounded-[var(--radius-md)] border border-border/60 bg-surface-muted/40 px-3 py-2 text-[0.75rem] text-muted-foreground">
				<Search className="size-3.5" strokeWidth={1.6} />
				<span>Search transcripts, decks, briefs…</span>
			</div>
			{rows.map((r) => (
				<div
					key={r.name}
					className={cn(
						"relative grid grid-cols-[1fr_auto] gap-2 items-center px-3 py-2 sm:py-2.5 rounded-[var(--radius-md)] border bg-surface-muted/40 text-[0.8125rem] sm:text-[0.875rem] min-w-0 overflow-hidden",
						r.active
							? "border-ai/30 bg-ai-tint/60"
							: "border-border",
					)}
				>
					{r.active ? (
						<span
							aria-hidden="true"
							className="absolute inset-0 -translate-x-full motion-safe:animate-[skeleton-shimmer_2.6s_ease-in-out_infinite]"
							style={{
								background:
									"linear-gradient(90deg, transparent, oklch(0.62 0.19 245 / 0.15), transparent)",
							}}
						/>
					) : null}
					<span className="relative truncate text-foreground min-w-0">
						{r.name}
					</span>
					<span className="relative inline-flex items-center justify-center w-9 sm:w-10 shrink-0 rounded-[var(--radius-xs)] bg-card border border-border text-[0.6875rem] font-medium text-muted-foreground">
						{r.type}
					</span>
				</div>
			))}
		</div>
	);
});

/* Inbox — overshoot badge appearing on the unread thread */
const GmailVisual = memo(function GmailVisual() {
	const [pingOn, setPingOn] = useState(false);

	useEffect(() => {
		const id = window.setInterval(() => setPingOn((v) => !v), 3000);
		return () => window.clearInterval(id);
	}, []);

	const threads = [
		{
			from: "Jordan Chen",
			subject: "Re: Q3 launch — final scope",
			summary: "Approves scope. Wants design review by next Wednesday.",
			time: "2m",
			unread: true,
		},
		{
			from: "Priya Raman",
			subject: "Sprint planning recap",
			summary: "Sharing decisions: lock scope Fri, design review next week.",
			time: "1h",
			unread: false,
		},
		{
			from: "Marcus Vega",
			subject: "Pricing page update",
			summary: "Needs the new tier copy by EOD Thursday.",
			time: "3h",
			unread: false,
		},
	];

	return (
		<div className="px-5 sm:px-6 pb-5 sm:pb-6 flex flex-col gap-2">
			{threads.map((tr, idx) => (
				<div
					key={tr.subject}
					className={cn(
						"relative rounded-[var(--radius-md)] border bg-surface-muted/40 px-3.5 py-2.5 flex flex-col gap-1",
						tr.unread ? "border-ai/30" : "border-border/60",
					)}
				>
					<div className="flex items-center justify-between gap-3">
						<span className="text-[0.8125rem] font-medium text-foreground truncate">
							{tr.from}
						</span>
						<span className="text-[0.6875rem] text-muted-foreground font-mono">
							{tr.time}
						</span>
					</div>
					<div className="text-[0.875rem] text-foreground truncate">
						{tr.subject}
					</div>
					<div className="flex items-start gap-1.5 text-[0.75rem]">
						<Sparkles className="size-3 shrink-0 mt-0.5 text-ai" strokeWidth={1.7} />
						<span className="text-muted-foreground line-clamp-1">
							{tr.summary}
						</span>
					</div>
					{/* Overshoot "New" badge on the first thread */}
					{idx === 0 ? (
						<AnimatePresence>
							{pingOn ? (
								<motion.span
									key="new-badge"
									initial={{ scale: 0.6, opacity: 0, y: -4 }}
									animate={{ scale: 1, opacity: 1, y: 0 }}
									exit={{ scale: 0.85, opacity: 0, y: -2 }}
									transition={{
										type: "spring",
										stiffness: 320,
										damping: 14,
										mass: 0.5,
									}}
									className="absolute -top-1 -end-1 inline-flex items-center gap-1 rounded-full bg-ai text-ai-foreground px-1.5 py-0.5 text-[0.5625rem] font-medium shadow-[0_1px_2px_oklch(0_0_0/0.12)]"
								>
									<CircleCheck className="size-2.5" strokeWidth={2} />
									<span>Summarised</span>
								</motion.span>
							) : null}
						</AnimatePresence>
					) : null}
				</div>
			))}
		</div>
	);
});
