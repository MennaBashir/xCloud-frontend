import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
	CalendarDays,
	CircleCheck,
	FolderClosed,
	Inbox,
	MessageSquare,
	Mic,
	MicOff,
	Monitor,
	PhoneOff,
	PlayCircle,
	Sparkles,
	Users,
	Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EyebrowTag } from "@/shared/components/EyebrowTag";

import { HeroMagneticCta } from "../hero/HeroMagneticCta";
import { HeroTrustAvatars } from "../hero/HeroTrustAvatars";
import { HeroTiltMockup } from "../hero/HeroTiltMockup";

gsap.registerPlugin(useGSAP);

export function Hero() {
	const { t } = useTranslation("landing");
	const rootRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add(
				{
					default: "(prefers-reduced-motion: no-preference)",
					reduced: "(prefers-reduced-motion: reduce)",
				},
				(ctx) => {
					if (ctx.conditions?.reduced) return;

					const tl = gsap.timeline({
						defaults: { ease: "power3.out" },
					});
					tl.from(".hero-eyebrow", {
						y: 12,
						autoAlpha: 0,
						duration: 0.5,
					})
						.from(
							".hero-title-line",
							{
								y: 28,
								autoAlpha: 0,
								filter: "blur(8px)",
								duration: 0.85,
								stagger: 0.1,
							},
							"-=0.25",
						)
						.from(
							".hero-subtitle",
							{ y: 14, autoAlpha: 0, duration: 0.55 },
							"-=0.45",
						)
						.from(
							".hero-cta",
							{
								y: 10,
								autoAlpha: 0,
								duration: 0.5,
								stagger: 0.08,
							},
							"-=0.4",
						)
						.from(
							".hero-trust",
							{ autoAlpha: 0, duration: 0.6 },
							"-=0.3",
						)
						.from(
							".hero-mockup",
							{
								y: 36,
								autoAlpha: 0,
								filter: "blur(10px)",
								duration: 1,
								ease: "power4.out",
							},
							"-=0.7",
						);

					// SVG underline draw-in after the headline lands
					gsap.fromTo(
						".hero-accent-stroke",
						{ strokeDashoffset: 220 },
						{
							strokeDashoffset: 0,
							duration: 1.1,
							ease: "power2.out",
							delay: 0.85,
						},
					);

					// Mockup gentle float
					gsap.to(".hero-mockup-floater", {
						y: -8,
						duration: 4.2,
						ease: "sine.inOut",
						yoyo: true,
						repeat: -1,
					});
				},
			);

			return () => mm.revert();
		},
		{ scope: rootRef },
	);

	return (
		<section
			ref={rootRef}
			id="hero"
			className="relative isolate overflow-hidden pt-28 pb-16 xs:pt-32 xs:pb-20 sm:pt-40 sm:pb-28 lg:pt-44 lg:pb-32 scroll-mt-24"
		>
			{/* Soft mesh backdrop */}
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10"
				style={{
					background:
						"radial-gradient(at 18% 12%, oklch(0.62 0.19 245 / 0.18) 0px, transparent 50%)," +
						"radial-gradient(at 82% 8%, oklch(0.55 0.2 285 / 0.14) 0px, transparent 50%)," +
						"radial-gradient(at 50% 100%, oklch(0.65 0.16 162 / 0.08) 0px, transparent 60%)",
				}}
			/>
			{/* Hairline grid overlay */}
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 opacity-[0.045]"
				style={{
					backgroundImage:
						"linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
					backgroundSize: "64px 64px",
					maskImage:
						"radial-gradient(ellipse at top, black 30%, transparent 75%)",
				}}
			/>

			<div className="container mx-auto px-4 sm:px-6">
				{/* Centered copy column */}
				<div className="max-w-[860px] mx-auto text-center flex flex-col items-center gap-6">
					{/* Live pill — breathing dot + realistic count */}
					<div className="hero-eyebrow">
						<EyebrowTag withDot tone="ai">
							{t("hero.livePill", { count: "1,247" })}
						</EyebrowTag>
					</div>

					<h1 className="font-semibold tracking-tight leading-[1.04] text-[2.25rem] xs:text-[2.875rem] sm:text-[3.75rem] lg:text-[4.75rem] text-foreground [text-wrap:balance]">
						<span className="hero-title-line block">
							{t("hero.title.part1")}
						</span>
						<HeroTitleSecondLine
							raw={t("hero.title.part2")}
							underlineWord={t("hero.underlineWord")}
						/>
					</h1>

					<p className="hero-subtitle max-w-[60ch] text-[1rem] sm:text-[1.0625rem] leading-relaxed text-muted-foreground">
						{t("hero.subtitle")}
					</p>

					{/* CTAs — primary is magnetic */}
					<div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 mt-2 w-full xs:w-auto max-w-[420px] xs:max-w-none">
						<HeroMagneticCta
							className="hero-cta w-full xs:w-auto"
							label={t("hero.primaryCta")}
							href="/signup"
						/>
						<Button
							asChild
							size="pill"
							variant="outline"
							className="hero-cta group/btn w-full xs:w-auto justify-center"
						>
							<a href="#features">
								<PlayCircle
									className="size-4 text-ai"
									strokeWidth={1.6}
								/>
								<span>{t("hero.secondaryCta")}</span>
							</a>
						</Button>
					</div>

					{/* Trust — 5 squircle avatars + line */}
					<div className="hero-trust mt-3 flex flex-col xs:flex-row items-center gap-3 xs:gap-4">
						<HeroTrustAvatars />
						<span className="text-[0.8125rem] text-muted-foreground text-center xs:text-start max-w-[40ch]">
							{t("hero.trust")}
						</span>
					</div>
				</div>

				{/* Mockup — Double-Bezel + parallax tilt */}
				<div className="hero-mockup hero-mockup-floater mt-12 sm:mt-20 mx-auto max-w-[1080px]">
					<HeroTiltMockup>
						<MockupCore />
					</HeroTiltMockup>
				</div>
			</div>
		</section>
	);
}

/* ──────────────────────────────────────────────────────────────────────────
 * Headline second line — splits on the underline word and renders an SVG
 * draw-in underline beneath it. No text-fill gradient.
 * ──────────────────────────────────────────────────────────────────────── */
function HeroTitleSecondLine({
	raw,
	underlineWord,
}: {
	raw: string;
	underlineWord: string;
}) {
	// Try to find the word. If not found, just render the raw string.
	const idx = raw.toLowerCase().indexOf(underlineWord.toLowerCase());
	if (idx === -1 || !underlineWord) {
		return <span className="hero-title-line block">{raw}</span>;
	}
	const before = raw.slice(0, idx);
	const word = raw.slice(idx, idx + underlineWord.length);
	const after = raw.slice(idx + underlineWord.length);

	return (
		<span className="hero-title-line block">
			{before}
			<span className="relative inline-block whitespace-nowrap">
				{word}
				<svg
					aria-hidden="true"
					viewBox="0 0 220 16"
					preserveAspectRatio="none"
					className="absolute -bottom-1 sm:-bottom-2 inset-x-0 w-full h-[6px] sm:h-[10px] overflow-visible"
				>
					<defs>
						<linearGradient
							id="hero-accent-grad"
							x1="0"
							y1="0"
							x2="1"
							y2="0"
						>
							<stop offset="0%" stopColor="oklch(0.62 0.19 245)" />
							<stop offset="100%" stopColor="oklch(0.55 0.2 285)" />
						</linearGradient>
					</defs>
					<path
						className="hero-accent-stroke"
						d="M2 10 C 40 2, 90 14, 150 6 S 210 10, 218 8"
						fill="none"
						stroke="url(#hero-accent-grad)"
						strokeWidth="4"
						strokeLinecap="round"
						strokeDasharray="220"
						strokeDashoffset="0"
					/>
				</svg>
			</span>
			{after}
		</span>
	);
}

/* ──────────────────────────────────────────────────────────────────────────
 * MockupCore — same content as before, padding tuned for centered layout.
 * ──────────────────────────────────────────────────────────────────────── */
type Participant = {
	name: string;
	initials: string;
	role: string;
	from: string;
	to: string;
	fg: string;
	speaking: boolean;
	muted: boolean;
};

const PARTICIPANTS: Participant[] = [
	{
		name: "Priya Raman",
		initials: "PR",
		role: "Product Lead",
		from: "oklch(0.74 0.16 285)",
		to: "oklch(0.62 0.19 245)",
		fg: "oklch(0.98 0.01 250)",
		speaking: true,
		muted: false,
	},
	{
		name: "Marcus Vale",
		initials: "MV",
		role: "Engineering",
		from: "oklch(0.78 0.13 162)",
		to: "oklch(0.62 0.16 162)",
		fg: "oklch(0.98 0.01 160)",
		speaking: false,
		muted: true,
	},
	{
		name: "Aisha Karim",
		initials: "AK",
		role: "Design",
		from: "oklch(0.82 0.14 75)",
		to: "oklch(0.7 0.16 50)",
		fg: "oklch(0.18 0.02 60)",
		speaking: false,
		muted: false,
	},
	{
		name: "Devon Tate",
		initials: "DT",
		role: "Marketing",
		from: "oklch(0.74 0.16 25)",
		to: "oklch(0.6 0.18 15)",
		fg: "oklch(0.98 0.01 20)",
		speaking: false,
		muted: true,
	},
];

function MockupCore() {
	const tasks = [
		{
			done: true,
			text: "Confirm Q3 launch scope with engineering",
			owner: "Priya",
		},
		{
			done: true,
			text: "Send roadmap deck to leadership by Friday",
			owner: "Marcus",
		},
		{
			done: false,
			text: "Schedule design review for onboarding revamp",
			owner: "Aisha",
		},
		{
			done: false,
			text: "Update pricing page with new tier",
			owner: "Devon",
		},
	];

	return (
		<div
			className={cn(
				"rounded-[calc(2rem-0.5rem)] bg-card border border-border overflow-hidden",
				"shadow-[inset_0_1px_0_oklch(1_0_0/0.06)]",
			)}
		>
			{/* Browser chrome */}
			<div className="flex items-center gap-1.5 px-3 sm:px-4 h-9 border-b border-border bg-surface-muted/60">
				<span className="size-2.5 rounded-full bg-[oklch(0.78_0.18_25)]/40 shrink-0" />
				<span className="size-2.5 rounded-full bg-[oklch(0.85_0.16_85)]/40 shrink-0" />
				<span className="size-2.5 rounded-full bg-[oklch(0.75_0.16_160)]/40 shrink-0" />
				<span className="ms-2 sm:ms-3 text-[0.6875rem] text-muted-foreground font-mono truncate">
					sprintifai.com/app/meeting
				</span>
				<span className="ms-auto inline-flex items-center gap-1.5 text-[0.625rem] text-muted-foreground font-mono">
					<span className="relative grid size-1.5 place-items-center">
						<span
							aria-hidden="true"
							className="absolute inset-0 rounded-full bg-destructive/55 animate-ping"
							style={{ animationDuration: "2s" }}
						/>
						<span className="relative size-1.5 rounded-full bg-destructive" />
					</span>
					<span className="hidden sm:inline">Rec · 12:47</span>
				</span>
			</div>

			{/* Body */}
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] lg:min-h-[440px]">
				{/* Left: meeting tile */}
				<div className="relative p-3 sm:p-5 border-b lg:border-b-0 lg:border-e border-border">
					<div className="flex items-center gap-2 mb-3 text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
						<span className="relative grid size-1.5 place-items-center">
							<span className="absolute inset-0 rounded-full bg-destructive/60 animate-ping" />
							<span className="relative size-1.5 rounded-full bg-destructive" />
						</span>
						<span>Live · Sprint planning</span>
					</div>

					{/* Video tiles */}
					<div className="grid grid-cols-2 gap-2.5">
						{PARTICIPANTS.map((person) => (
							<ParticipantTile key={person.initials} person={person} />
						))}
					</div>

					{/* Meeting control bar — mirrors the real in-call BottomBar */}
					<MeetingControlBar />

					{/* Caption */}
					<div className="mt-4 rounded-[var(--radius-md)] border border-border bg-surface-muted/60 px-3 py-2.5 flex items-start gap-2">
						<Sparkles
							className="size-3.5 mt-0.5 text-ai shrink-0"
							strokeWidth={1.6}
						/>
						<p className="text-[0.8125rem] leading-relaxed text-foreground">
							<span className="text-muted-foreground">Priya:</span>{" "}
							Let&apos;s lock the launch scope before Friday and assign
							the design review to Aisha.
						</p>
					</div>
				</div>

				{/* Right: AI summary */}
				<div className="p-3 sm:p-5 flex flex-col gap-4 bg-surface-muted/30">
					<div className="flex items-center justify-between">
						<span className="inline-flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ai">
							<Sparkles className="size-3" strokeWidth={1.8} />
							AI Summary
						</span>
						<span className="text-[0.6875rem] text-muted-foreground font-mono">
							2 min ago
						</span>
					</div>

					<div className="text-[0.875rem] leading-relaxed text-foreground">
						Team agreed to lock Q3 launch scope by Friday. Design
						review for onboarding moved to next week.
					</div>

					<div className="flex flex-col gap-1.5">
						<span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
							Action items
						</span>
						<ul className="flex flex-col gap-1.5">
							{tasks.map((task, i) => (
								<li
									key={i}
									className="flex items-start gap-2 text-[0.8125rem]"
								>
									<CircleCheck
										className={cn(
											"size-3.5 mt-0.5 shrink-0",
											task.done
												? "text-success"
												: "text-muted-foreground/50",
										)}
										strokeWidth={1.6}
									/>
									<span
										className={cn(
											task.done && "text-muted-foreground line-through",
										)}
									>
										{task.text}
										<span className="ms-1 text-muted-foreground">
											· {task.owner}
										</span>
									</span>
								</li>
							))}
						</ul>
					</div>

					<div className="mt-auto grid grid-cols-2 gap-2">
						{[
							{ icon: CalendarDays, label: "4 tasks" },
							{ icon: FolderClosed, label: "Saved" },
							{ icon: Video, label: "Recorded" },
							{ icon: Inbox, label: "Recap" },
						].map((chip) => (
							<span
								key={chip.label}
								className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-card px-2.5 py-1.5 text-[0.75rem] text-muted-foreground"
							>
								<chip.icon
									className="size-3 shrink-0"
									strokeWidth={1.6}
								/>
								<span>{chip.label}</span>
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

/* ──────────────────────────────────────────────────────────────────────────
 * ParticipantTile — a real meeting-account tile: gradient avatar with the
 * person's initials, a name + role label, live mic state, and a speaking
 * ring for the active speaker. Reads like a real roster, not flat swatches.
 * ──────────────────────────────────────────────────────────────────────── */
function ParticipantTile({ person }: { person: Participant }) {
	const gradientId = `tile-grad-${person.initials.toLowerCase()}`;
	return (
		<div
			className={cn(
				"aspect-[4/3] rounded-[var(--radius-lg)] bg-surface-muted relative overflow-hidden",
				"ring-1 ring-inset",
				person.speaking
					? "ring-2 ring-success"
					: "ring-border",
			)}
		>
			{/* Camera feed stand-in — soft tinted vignette */}
			<div
				aria-hidden="true"
				className="absolute inset-0"
				style={{
					backgroundImage: `radial-gradient(at 50% 38%, ${person.from} / 0.28, transparent 68%)`,
				}}
			/>

			{/* Account avatar */}
			<div className="absolute inset-0 grid place-items-center">
				<span className="relative inline-grid place-items-center size-11 sm:size-12">
					<svg
						width="48"
						height="48"
						viewBox="0 0 48 48"
						className="absolute inset-0 rounded-full"
						aria-hidden="true"
					>
						<defs>
							<linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
								<stop offset="0%" stopColor={person.from} />
								<stop offset="100%" stopColor={person.to} />
							</linearGradient>
						</defs>
						<circle cx="24" cy="24" r="24" fill={`url(#${gradientId})`} />
					</svg>
					<span
						className="relative text-[0.8125rem] font-semibold tracking-tight"
						style={{ color: person.fg }}
					>
						{person.initials}
					</span>
				</span>
			</div>

			{/* Name card — full name + role, with a live mic chip */}
			<div className="absolute inset-x-2 bottom-2 flex items-center gap-2 rounded-[var(--radius-sm)] bg-black/55 backdrop-blur-md px-2 py-1.5 ring-1 ring-inset ring-white/10">
				<span
					className={cn(
						"grid size-5 shrink-0 place-items-center rounded-full",
						person.muted ? "bg-white/15" : "bg-success/85",
					)}
				>
					{person.muted ? (
						<MicOff className="size-3 text-white/80" strokeWidth={1.8} />
					) : (
						<Mic className="size-3 text-white" strokeWidth={1.8} />
					)}
				</span>
				<span className="flex flex-col min-w-0 leading-tight">
					<span className="truncate text-[0.6875rem] font-semibold text-white">
						{person.name}
					</span>
					<span className="truncate text-[0.5625rem] text-white/60">
						{person.role}
					</span>
				</span>
			</div>

			{/* Speaking pulse */}
			{person.speaking && (
				<span className="absolute top-2 end-2 inline-flex items-center gap-1 rounded-full bg-success/90 text-white px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-wide">
					<span className="size-1 rounded-full bg-white animate-pulse" />
					Speaking
				</span>
			)}
		</div>
	);
}

/* ──────────────────────────────────────────────────────────────────────────
 * MeetingControlBar — a static mirror of the real in-call BottomBar. Same
 * control cluster (mic / cam / share / record / chat / participants / leave)
 * so the landing preview reads like the actual product, not a generic card.
 * ──────────────────────────────────────────────────────────────────────── */
function MeetingControlBar() {
	return (
		<div className="mt-4 flex items-center gap-2 rounded-[var(--radius-lg)] bg-foreground/[0.04] ring-1 ring-inset ring-border px-2.5 py-2">
			<div className="flex-1 flex items-center justify-center gap-1.5">
				<CtrlButton icon={Mic} label="Mic on" state="on" />
				<CtrlButton icon={Video} label="Camera on" state="on" />
				<CtrlButton icon={Monitor} label="Share screen" />
				<CtrlButton icon={CircleCheck} label="Recording" state="rec" />
				<CtrlButton icon={MessageSquare} label="Chat" />
				<CtrlButton icon={Users} label="Participants" badge={4} />
			</div>
			<CtrlButton icon={PhoneOff} label="Leave" state="leave" />
		</div>
	);
}

function CtrlButton({
	icon: Icon,
	label,
	state,
	badge,
}: {
	icon: LucideIcon;
	label: string;
	state?: "on" | "rec" | "leave";
	badge?: number;
}) {
	return (
		<span
			role="img"
			aria-label={label}
			className={cn(
				"relative grid size-8 sm:size-9 place-items-center rounded-full ring-1 ring-inset",
				state === "leave"
					? "bg-destructive text-white ring-transparent shadow-[0_1px_2px_oklch(0_0_0/0.12)]"
					: state === "rec"
						? "bg-destructive/12 text-destructive ring-destructive/25"
						: state === "on"
							? "bg-surface-muted text-foreground ring-border"
							: "bg-card text-muted-foreground ring-border",
			)}
		>
			<Icon className="size-3.5 sm:size-4" strokeWidth={1.7} />
			{state === "rec" && (
				<span
					aria-hidden="true"
					className="absolute -top-0.5 -end-0.5 size-1.5 rounded-full bg-destructive animate-pulse"
				/>
			)}
			{typeof badge === "number" && (
				<span className="absolute -top-1 -end-1 grid min-w-4 h-4 place-items-center rounded-full bg-ai px-1 text-[0.5625rem] font-semibold text-ai-foreground ring-2 ring-card">
					{badge}
				</span>
			)}
		</span>
	);
}

