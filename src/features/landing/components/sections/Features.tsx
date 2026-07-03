import { memo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import {
	CalendarDays,
	Check,
	CircleCheck,
	FolderClosed,
	type LucideIcon,
	Inbox,
	MessageSquare,
	Mic,
	MicOff,
	Monitor,
	PhoneOff,
	Sparkles,
	Users,
	Video,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { EyebrowTag } from "@/shared/components/EyebrowTag";

/* ──────────────────────────────────────────────────────────────────────────
 * Features section — the connection thesis
 *
 * Composition (top → bottom):
 *   1. ConnectedWorkspaceDiagram  — Meeting "stage" at the top emits a
 *      decision through four AI-tinted flow lines into four destination
 *      cards (Chat / Calendar / Files / Inbox). Reduced-motion users see
 *      static dashed lines and no traveling tokens.
 *   2. ChatHeroRow                — Chat AI as the connector. Cited answer
 *      with four source pills (Meeting / Calendar / Files / Inbox) makes
 *      the cross-surface connection literal.
 *
 * Animation engine: motion/react only. SVG path tokens use CSS
 * `offset-path` + keyframe animation so the loop is GPU-only and never
 * triggers React renders. Reduced-motion gates the keyframe via a
 * motion-safe variant.
 * ──────────────────────────────────────────────────────────────────────── */

export function Features() {
	const { t } = useTranslation("landing");

	return (
		<section
			id="features"
			className="relative py-20 sm:py-32 lg:py-40 scroll-mt-24"
		>
			<div className="container mx-auto px-4 sm:px-6">
				<header className="flex flex-col items-center text-center gap-4 mb-12 sm:mb-20">
					<EyebrowTag>{t("features.eyebrow")}</EyebrowTag>
					<h2 className="font-semibold tracking-tight leading-[1.08] text-[1.75rem] xs:text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] xl:text-[3.75rem] text-foreground [text-wrap:balance] max-w-[920px] lg:max-w-[1040px] mx-auto">
						{t("features.sectionTitle")}
					</h2>
					<p className="text-[1rem] sm:text-[1.0625rem] leading-relaxed text-muted-foreground max-w-[60ch] mx-auto">
						{t("features.sectionSubtitle")}
					</p>
				</header>

				<ConnectedWorkspaceDiagram />

				<div className="mt-20 sm:mt-32">
					<ChatHeroRow />
				</div>
			</div>
		</section>
	);
}

/* ════════════════════════════════════════════════════════════════════════════
 * Double-Bezel — shared nested enclosure
 * ════════════════════════════════════════════════════════════════════════════ */

function DoubleBezel({
	children,
	className,
	innerClassName,
}: {
	children: React.ReactNode;
	className?: string;
	innerClassName?: string;
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
					innerClassName,
				)}
			>
				{children}
			</div>
		</div>
	);
}

/* ════════════════════════════════════════════════════════════════════════════
 * Tone palette — shared by diagram, ribbon, and chat hero
 * ════════════════════════════════════════════════════════════════════════════ */

type Tone = "ai" | "emerald" | "amber" | "rose";

const TONE_CLASS: Record<Tone, string> = {
	ai: "bg-ai-tint text-ai ring-ai/25",
	emerald: "bg-[oklch(0.65_0.16_162/0.12)] text-success ring-success/25",
	amber: "bg-[oklch(0.82_0.15_75/0.16)] text-warning ring-warning/25",
	rose: "bg-[oklch(0.68_0.2_27/0.12)] text-destructive ring-destructive/25",
};

const TONE_STROKE: Record<Tone, string> = {
	ai: "oklch(var(--ai) / 0.5)",
	emerald: "oklch(0.65 0.16 162 / 0.5)",
	amber: "oklch(0.82 0.15 75 / 0.55)",
	rose: "oklch(0.68 0.2 27 / 0.5)",
};

/* ════════════════════════════════════════════════════════════════════════════
 * ConnectedWorkspaceDiagram — "Hub Stage"
 *
 * A wide Meeting "stage" sits at the top, ringed in AI tint, with a built-in
 * decision bar at its bottom edge ("Lock Q3 launch scope · Priya · Friday").
 * Four AI-tinted dashed flow lines fan down from four anchor points on the
 * decision bar to the top edge of four portrait destination cards laid out
 * in a single horizontal track. A traveling token rides each flow line on a
 * staggered loop (CSS `offset-path` keyframes — zero JS).
 *
 * Mobile: stage at top, vertical trunk, destinations stacked below.
 * Reduced-motion: tokens hidden, dashed flow lines remain.
 * ════════════════════════════════════════════════════════════════════════════ */

const ConnectedWorkspaceDiagram = memo(function ConnectedWorkspaceDiagram() {
	const { t } = useTranslation("landing");

	return (
		<motion.div
			initial={{ y: 28, opacity: 0, filter: "blur(8px)" }}
			whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
		>
			<DoubleBezel>
				<div className="relative overflow-hidden">
					{/* Layered backdrop — dot pattern + soft AI halo behind the stage */}
					<div
						aria-hidden="true"
						className="absolute inset-0 pointer-events-none opacity-[0.35]"
						style={{
							backgroundImage:
								"radial-gradient(oklch(var(--border)) 1px, transparent 1px)",
							backgroundSize: "28px 28px",
							maskImage:
								"radial-gradient(ellipse at 50% 35%, black 0%, transparent 75%)",
							WebkitMaskImage:
								"radial-gradient(ellipse at 50% 35%, black 0%, transparent 75%)",
						}}
					/>
					<div
						aria-hidden="true"
						className="absolute inset-0 pointer-events-none"
						style={{
							backgroundImage:
								"radial-gradient(ellipse at 50% 28%, oklch(var(--ai) / 0.07), transparent 60%)",
						}}
					/>

					<div className="relative p-4 xs:p-5 sm:p-8 lg:p-10">
						{/* Title strip */}
						<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-5 sm:mb-8">
							<span className="inline-flex items-center gap-2 text-[0.625rem] xs:text-[0.6875rem] uppercase tracking-[0.16em] xs:tracking-[0.18em] text-muted-foreground">
								<span className="relative grid size-1.5 place-items-center">
									<span
										aria-hidden="true"
										className="absolute inset-0 rounded-full bg-ai/60 motion-safe:animate-ping"
									/>
									<span className="relative size-1.5 rounded-full bg-ai" />
								</span>
								{t("features.diagram.label")}
							</span>
							<span className="hidden sm:inline text-[0.6875rem] font-mono text-muted-foreground">
								{t("features.diagram.sourceMeeting")} ·{" "}
								{t("features.diagram.sourceTime")}
							</span>
						</div>

						<HubStage />
					</div>
				</div>
			</DoubleBezel>
		</motion.div>
	);
});

/* ════════════════════════════════════════════════════════════════════════════
 * HubStage layout — stage card on top, flow layer in the middle,
 * destination track on the bottom.
 * ════════════════════════════════════════════════════════════════════════════ */

const DESTINATIONS: Array<{
	key: string;
	icon: LucideIcon;
	tone: Tone;
	nameKey: string;
	payloadKey: string;
}> = [
	{
		key: "chat",
		icon: Sparkles,
		tone: "ai",
		nameKey: "features.chat.eyebrow",
		payloadKey: "features.diagram.satellites.chat",
	},
	{
		key: "calendar",
		icon: CalendarDays,
		tone: "emerald",
		nameKey: "features.calendar.eyebrow",
		payloadKey: "features.diagram.satellites.calendar",
	},
	{
		key: "files",
		icon: FolderClosed,
		tone: "amber",
		nameKey: "features.files.eyebrow",
		payloadKey: "features.diagram.satellites.files",
	},
	{
		key: "gmail",
		icon: Inbox,
		tone: "rose",
		nameKey: "features.gmail.eyebrow",
		payloadKey: "features.diagram.satellites.gmail",
	},
];

function HubStage() {
	const { t } = useTranslation("landing");

	return (
		<div className="relative flex flex-col items-center gap-0">
			{/* Stage — the source */}
			<StageCard />

			{/* Flow layer — visible on sm+, vertical hint on mobile */}
			<FlowLayer />

			{/* Destination track */}
			<ul
				role="list"
				className={cn(
					"relative w-full mt-5 sm:mt-7",
					"grid gap-3 sm:gap-4",
					"grid-cols-1 xs:grid-cols-2 lg:grid-cols-4",
				)}
				aria-label={t("features.diagram.label")}
			>
				{DESTINATIONS.map((d) => (
					<li key={d.key}>
						<DestinationCard
							icon={d.icon}
							tone={d.tone}
							name={t(d.nameKey)}
							payload={t(d.payloadKey)}
						/>
					</li>
				))}
			</ul>
		</div>
	);
}

/* ════════════════════════════════════════════════════════════════════════════
 * StageCard — wider Meeting card with built-in decision bar at the bottom edge
 * ════════════════════════════════════════════════════════════════════════════ */

type StageParticipant = {
	name: string;
	role: string;
	initials: string;
	from: string;
	to: string;
	fg: string;
	speaking: boolean;
	muted: boolean;
};

const STAGE_PARTICIPANTS: StageParticipant[] = [
	{
		name: "Priya Raman",
		role: "Product Lead",
		initials: "PR",
		from: "oklch(0.74 0.16 285)",
		to: "oklch(0.62 0.19 245)",
		fg: "oklch(0.98 0.01 250)",
		speaking: true,
		muted: false,
	},
	{
		name: "Marcus Vale",
		role: "Engineering",
		initials: "MV",
		from: "oklch(0.78 0.13 162)",
		to: "oklch(0.62 0.16 162)",
		fg: "oklch(0.98 0.01 160)",
		speaking: false,
		muted: true,
	},
	{
		name: "Aisha Karim",
		role: "Design",
		initials: "AK",
		from: "oklch(0.82 0.14 75)",
		to: "oklch(0.7 0.16 50)",
		fg: "oklch(0.18 0.02 60)",
		speaking: false,
		muted: false,
	},
	{
		name: "Devon Tate",
		role: "Marketing",
		initials: "DT",
		from: "oklch(0.74 0.16 25)",
		to: "oklch(0.6 0.18 15)",
		fg: "oklch(0.98 0.01 20)",
		speaking: false,
		muted: true,
	},
];

function StageParticipantTile({ person }: { person: StageParticipant }) {
	const gradientId = `stage-grad-${person.initials.toLowerCase()}`;
	return (
		<div
			className={cn(
				"aspect-[16/10] rounded-[var(--radius-sm)] bg-surface-muted relative overflow-hidden",
				"ring-1 ring-inset",
				person.speaking ? "ring-2 ring-success" : "ring-border/70",
			)}
		>
			{/* Camera feed stand-in — soft tinted vignette */}
			<div
				aria-hidden="true"
				className="absolute inset-0"
				style={{
					backgroundImage: `radial-gradient(at 50% 40%, ${person.from} / 0.24, transparent 66%)`,
				}}
			/>

			{/* Account avatar */}
			<div className="absolute inset-0 grid place-items-center">
				<span className="relative inline-grid place-items-center size-8 xs:size-9">
					<svg
						width="36"
						height="36"
						viewBox="0 0 36 36"
						className="absolute inset-0 rounded-full"
						aria-hidden="true"
					>
						<defs>
							<linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
								<stop offset="0%" stopColor={person.from} />
								<stop offset="100%" stopColor={person.to} />
							</linearGradient>
						</defs>
						<circle cx="18" cy="18" r="18" fill={`url(#${gradientId})`} />
					</svg>
					<span
						className="relative text-[0.625rem] font-semibold tracking-tight"
						style={{ color: person.fg }}
					>
						{person.initials}
					</span>
				</span>
			</div>

			{/* Name card — full name + role, with a live mic chip */}
			<div className="absolute inset-x-1.5 bottom-1.5 flex items-center gap-1.5 rounded-[var(--radius-xs)] bg-black/55 backdrop-blur-md px-1.5 py-1 ring-1 ring-inset ring-white/10">
				<span
					className={cn(
						"grid size-4 shrink-0 place-items-center rounded-full",
						person.muted ? "bg-white/15" : "bg-success/85",
					)}
				>
					{person.muted ? (
						<MicOff className="size-2.5 text-white/80" strokeWidth={1.9} />
					) : (
						<Mic className="size-2.5 text-white" strokeWidth={1.9} />
					)}
				</span>
				<span className="flex flex-col min-w-0 leading-none gap-0.5">
					<span className="truncate text-[0.5625rem] font-semibold text-white">
						{person.name}
					</span>
					<span className="hidden xs:block truncate text-[0.5rem] text-white/60">
						{person.role}
					</span>
				</span>
			</div>

			{/* Speaking badge */}
			{person.speaking && (
				<span className="absolute top-1.5 end-1.5 inline-flex items-center gap-1 rounded-full bg-success/85 text-white px-1.5 py-0.5 text-[0.5rem] font-medium">
					<span
						aria-hidden="true"
						className="size-1 rounded-full bg-white motion-safe:animate-pulse"
					/>
					<span className="hidden xs:inline">Speaking</span>
				</span>
			)}
		</div>
	);
}

/* ────────────────────────────────────────────────────────────────────────
 * StageControlBar — compact mirror of the real in-call BottomBar so the
 * "connected surfaces" preview reads like the actual meeting product.
 * ──────────────────────────────────────────────────────────────────────── */
function StageControlBar() {
	return (
		<div className="flex items-center gap-1.5 rounded-[var(--radius-md)] bg-foreground/[0.04] ring-1 ring-inset ring-border px-2 py-1.5">
			<div className="flex-1 flex items-center justify-center gap-1 xs:gap-1.5">
				<StageCtrlButton icon={Mic} label="Mic on" state="on" />
				<StageCtrlButton icon={Video} label="Camera on" state="on" />
				<StageCtrlButton icon={Monitor} label="Share screen" />
				<StageCtrlButton icon={CircleCheck} label="Recording" state="rec" />
				<StageCtrlButton icon={MessageSquare} label="Chat" />
				<StageCtrlButton icon={Users} label="Participants" badge={4} />
			</div>
			<StageCtrlButton icon={PhoneOff} label="Leave" state="leave" />
		</div>
	);
}

function StageCtrlButton({
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
				"relative grid size-6 xs:size-7 place-items-center rounded-full ring-1 ring-inset",
				state === "leave"
					? "bg-destructive text-white ring-transparent shadow-[0_1px_2px_oklch(0_0_0/0.12)]"
					: state === "rec"
						? "bg-destructive/12 text-destructive ring-destructive/25"
						: state === "on"
							? "bg-surface-muted text-foreground ring-border"
							: "bg-card text-muted-foreground ring-border",
			)}
		>
			<Icon className="size-3 xs:size-3.5" strokeWidth={1.7} />
			{state === "rec" && (
				<span
					aria-hidden="true"
					className="absolute -top-0.5 -end-0.5 size-1.5 rounded-full bg-destructive motion-safe:animate-pulse"
				/>
			)}
			{typeof badge === "number" && (
				<span className="absolute -top-1 -end-1 grid min-w-3.5 h-3.5 place-items-center rounded-full bg-ai px-0.5 text-[0.5rem] font-semibold text-ai-foreground ring-2 ring-card">
					{badge}
				</span>
			)}
		</span>
	);
}

const StageCard = memo(function StageCard() {
	const { t } = useTranslation("landing");

	return (
		<div
			className={cn(
				"relative z-10 w-full max-w-[520px] md:max-w-[600px] lg:max-w-[680px] mx-auto",
				"rounded-[1.5rem] p-1 sm:p-1.5",
				"bg-ai/[0.05] ring-1 ring-inset ring-ai/30",
				"shadow-[0_1px_2px_oklch(0_0_0/0.05),0_28px_56px_-24px_oklch(var(--ai)/0.4)]",
			)}
		>
			<div
				className={cn(
					"rounded-[calc(1.5rem-0.375rem)] border border-border bg-card overflow-hidden",
					"shadow-[inset_0_1px_0_oklch(1_0_0/0.06)]",
				)}
			>
				{/* Meeting header */}
				<div className="px-3 xs:px-4 py-2.5 xs:py-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-border/60 bg-surface-muted/40">
					<span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
						<span className="grid size-6 place-items-center rounded-[var(--radius-xs)] bg-ai-tint text-ai ring-1 ring-inset ring-ai/25 shrink-0">
							<Video className="size-3.5" strokeWidth={1.7} />
						</span>
						<span className="text-[0.8125rem] font-medium text-foreground truncate">
							{t("features.diagram.sourceMeeting")}
						</span>
						<span className="inline-flex items-center gap-1.5 text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground shrink-0">
							<span className="relative grid size-1.5 place-items-center">
								<span
									aria-hidden="true"
									className="absolute inset-0 rounded-full bg-destructive/55 motion-safe:animate-ping"
								/>
								<span className="relative size-1.5 rounded-full bg-destructive" />
							</span>
							Live
						</span>
					</span>
					<span className="text-[0.6875rem] font-mono text-muted-foreground shrink-0">
						{t("features.diagram.sourceTime")}
					</span>
				</div>

				{/* Video tiles */}
				<div className="grid grid-cols-2 gap-2 px-3 pt-3 pb-2">
					{STAGE_PARTICIPANTS.map((person) => (
						<StageParticipantTile key={person.initials} person={person} />
					))}
				</div>

				{/* Meeting control bar — mirrors the real in-call BottomBar */}
				<div className="px-3 pb-3">
					<StageControlBar />
				</div>

				{/* Decision bar — the payload "leaves" the meeting through this strip */}
				<div className="relative px-3 pb-3">
					<div
						className={cn(
							"relative flex items-center gap-2.5 rounded-[var(--radius-md)]",
							"bg-ai-tint ring-1 ring-inset ring-ai/30 px-3 py-2.5",
							"shadow-[inset_0_1px_0_oklch(1_0_0/0.05)]",
						)}
					>
						<Sparkles
							className="size-3.5 text-ai shrink-0 ambient-pulse"
							strokeWidth={1.7}
						/>
						<span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[0.8125rem] text-foreground min-w-0">
							<span className="font-medium truncate min-w-0">
								{t("features.diagram.tokenLabel")}
							</span>
							<span className="text-muted-foreground text-[0.75rem] whitespace-nowrap">
								· {t("features.diagram.tokenOwner")} ·{" "}
								{t("features.diagram.tokenDue")}
							</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
});

/* ════════════════════════════════════════════════════════════════════════════
 * FlowLayer — AI-tinted dashed paths from the decision bar to four destinations
 *
 * Uses an SVG positioned in the small vertical gap between the stage card and
 * the destination track. On mobile, falls back to a single vertical dashed
 * trunk hint (no fanning).
 * ════════════════════════════════════════════════════════════════════════════ */

function FlowLayer() {
	/* Source anchors on the decision bar, evenly spaced at x = 18 / 39 / 61 / 82.
	 * Destination anchors above each card top, x = 12 / 37 / 63 / 88.
	 * viewBox is 100 wide × 40 tall so the gap is shallow. */
	const paths = [
		"M18,2 C18,16 12,24 12,38",
		"M39,2 C39,16 37,24 37,38",
		"M61,2 C61,16 63,24 63,38",
		"M82,2 C82,16 88,24 88,38",
	];

	return (
		<>
			{/* Desktop (lg+): fan-out SVG. Below lg, the destinations stack
			    in 1 or 2 columns, so 4 fan-out anchors would land in nonsense
			    positions — use the vertical hint instead. */}
			<svg
				aria-hidden="true"
				className="hidden lg:block w-full h-[56px] mt-1"
				viewBox="0 0 100 40"
				preserveAspectRatio="none"
			>
				{paths.map((d, i) => (
					<FlowPath
						key={d}
						d={d}
						tone={DESTINATIONS[i].tone}
						delay={`${i * 0.6}s`}
					/>
				))}
			</svg>

			{/* Mobile + tablet: a single vertical dashed hint between stage
			    and destinations (covers everything below lg). */}
			<div
				aria-hidden="true"
				className="lg:hidden relative w-px h-8 my-2 mx-auto bg-[linear-gradient(to_bottom,transparent_0%,oklch(var(--ai)/0.45)_50%,transparent_100%)]"
			/>
		</>
	);
}

function FlowPath({
	d,
	tone,
	delay,
}: {
	d: string;
	tone: Tone;
	delay: string;
}) {
	return (
		<g>
			<path
				d={d}
				fill="none"
				stroke={TONE_STROKE[tone]}
				strokeWidth="1"
				strokeDasharray="3 4"
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
			/>
			<circle
				r="1.1"
				fill={TONE_STROKE[tone].replace(" / 0.5", "").replace(" / 0.55", "")}
				className="motion-safe:[animation:diagram-token-travel_3.6s_cubic-bezier(0.32,0.72,0,1)_infinite] motion-reduce:hidden"
				style={{
					offsetPath: `path("${d}")`,
					offsetDistance: "0%",
					animationDelay: delay,
					filter: "drop-shadow(0 0 1.5px currentColor)",
				}}
				vectorEffect="non-scaling-stroke"
			/>
		</g>
	);
}

/* ════════════════════════════════════════════════════════════════════════════
 * DestinationCard — portrait chip receiving its slice of the decision
 * ════════════════════════════════════════════════════════════════════════════ */

const DestinationCard = memo(function DestinationCard({
	icon: Icon,
	tone,
	name,
	payload,
}: {
	icon: LucideIcon;
	tone: Tone;
	name: string;
	payload: string;
}) {
	const { t } = useTranslation("landing");

	return (
		<div
			className={cn(
				"relative h-full rounded-[1.125rem] p-[3px]",
				"bg-foreground/[0.035] ring-1 ring-inset ring-border",
				"shadow-[0_1px_2px_oklch(0_0_0/0.03),0_14px_28px_-18px_oklch(0_0_0/0.14)]",
			)}
		>
			{/* Receiving edge — colored hairline at the top */}
			<div
				aria-hidden="true"
				className="absolute top-0 inset-x-3 h-px"
				style={{ background: TONE_STROKE[tone] }}
			/>
			<div
				className={cn(
					"h-full rounded-[calc(1.125rem-3px)] border border-border bg-card",
					"shadow-[inset_0_1px_0_oklch(1_0_0/0.05)]",
					"px-3.5 py-3.5 xs:px-4 xs:py-4 flex flex-col gap-2.5",
				)}
			>
				<div className="flex items-center gap-2">
					<span
						className={cn(
							"grid size-7 place-items-center rounded-[var(--radius-sm)] ring-1 ring-inset",
							TONE_CLASS[tone],
						)}
					>
						<Icon className="size-3.5" strokeWidth={1.7} />
					</span>
					<span className="text-[0.8125rem] font-medium text-foreground truncate">
						{name}
					</span>
				</div>
				<p className="text-[0.8125rem] leading-snug text-foreground/90 [text-wrap:balance] flex-1">
					{payload}
				</p>
				<span className="text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground inline-flex items-center gap-1.5">
					<Sparkles className="size-2.5 text-ai" strokeWidth={1.7} />
					{t("features.diagram.sourceNote")}
				</span>
			</div>
		</div>
	);
});


/* ════════════════════════════════════════════════════════════════════════════
 * ChatHeroRow — Chat AI as the literal cross-surface connector
 * ════════════════════════════════════════════════════════════════════════════ */

function ChatHeroRow() {
	const { t } = useTranslation("landing");
	const bullets = [
		t("features.chatHero.bullets.a"),
		t("features.chatHero.bullets.b"),
		t("features.chatHero.bullets.c"),
	];

	return (
		<motion.article
			initial={{ y: 32, opacity: 0, filter: "blur(8px)" }}
			whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
			className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr] items-center gap-10 sm:gap-12 md:gap-14"
		>
			{/* Copy */}
			<div className="flex flex-col gap-5 max-w-[520px] mx-auto md:mx-0">
				<div className="inline-flex items-center gap-2 self-start">
					<span className="inline-flex items-center justify-center size-7 rounded-[var(--radius-sm)] bg-ai-tint text-ai ring-1 ring-inset ring-ai/25">
						<Sparkles className="size-3.5 ambient-pulse" strokeWidth={1.7} />
					</span>
					<span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
						{t("features.chat.eyebrow")}
					</span>
				</div>

				<h3 className="font-semibold tracking-tight leading-[1.1] text-[1.5rem] xs:text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] text-foreground [text-wrap:balance]">
					{t("features.chat.title")}
				</h3>

				<p className="text-[1rem] sm:text-[1.0625rem] leading-relaxed text-muted-foreground">
					{t("features.chat.description")}
				</p>

				<ul className="flex flex-col gap-2.5 mt-2">
					{bullets.map((b) => (
						<li
							key={b}
							className="flex items-start gap-2.5 text-[0.9375rem] text-foreground"
						>
							<span className="mt-0.5 grid size-5 place-items-center rounded-full shrink-0 bg-ai-tint text-ai ring-1 ring-inset ring-ai/20">
								<Check className="size-3" strokeWidth={2} />
							</span>
							<span className="leading-relaxed">{b}</span>
						</li>
					))}
				</ul>
			</div>

			{/* Visual — Double-Bezel cited answer with cross-surface sources */}
			<DoubleBezel className="w-full max-w-[560px] mx-auto md:max-w-none md:mx-0 lg:[&]:scale-[1.02]">
				<ChatCitedAnswerVisual />
			</DoubleBezel>
		</motion.article>
	);
}

const ChatCitedAnswerVisual = memo(function ChatCitedAnswerVisual() {
	const { t } = useTranslation("landing");

	const sources: Array<{
		key: string;
		icon: LucideIcon;
		tone: Tone;
		label: string;
	}> = [
		{
			key: "meeting",
			icon: Video,
			tone: "ai",
			label: t("features.chatHero.sources.meeting"),
		},
		{
			key: "calendar",
			icon: CalendarDays,
			tone: "emerald",
			label: t("features.chatHero.sources.calendar"),
		},
		{
			key: "files",
			icon: FolderClosed,
			tone: "amber",
			label: t("features.chatHero.sources.files"),
		},
		{
			key: "gmail",
			icon: Inbox,
			tone: "rose",
			label: t("features.chatHero.sources.gmail"),
		},
	];

	return (
		<div className="p-5 sm:p-6 flex flex-col gap-4 h-full">
			{/* User question */}
			<div className="flex items-start gap-3">
				<div className="size-7 rounded-full bg-surface-muted shrink-0 ring-1 ring-inset ring-border" />
				<div className="rounded-2xl bg-surface-muted/60 px-3.5 py-2.5 text-[0.875rem] text-foreground">
					What did we agree on for the Q3 launch?
				</div>
			</div>

			{/* AI answer */}
			<div className="flex items-start gap-3 flex-row-reverse">
				<div className="size-7 rounded-full bg-ai-tint text-ai grid place-items-center shrink-0 ring-1 ring-inset ring-ai/20 ambient-pulse">
					<Sparkles className="size-3.5" strokeWidth={1.7} />
				</div>
				<div className="rounded-2xl bg-ai-tint/70 text-foreground px-3.5 py-3 text-[0.875rem] leading-relaxed max-w-[90%] xs:max-w-[88%] flex flex-col gap-2.5">
					<span>
						Locked scope by Friday. Owner:{" "}
						<span className="font-medium">Priya</span>.
						<span
							aria-hidden="true"
							className="inline-block w-[2px] h-3.5 ms-0.5 bg-ai animate-pulse align-middle"
							style={{ animationDuration: "1.1s" }}
						/>
					</span>

					{/* Cross-surface source pills */}
					<div className="pt-2 mt-0.5 border-t border-ai/15 flex flex-col gap-2">
						<span className="text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground font-medium">
							{t("features.chatHero.sourcesLabel")}
						</span>
						<div className="flex flex-wrap gap-1.5">
							{sources.map((s) => (
								<span
									key={s.key}
									className={cn(
										"inline-flex items-center gap-1.5 rounded-full px-2 py-1",
										"text-[0.6875rem] font-medium",
										"bg-card border border-border",
										"shadow-[inset_0_1px_0_oklch(1_0_0/0.04)]",
									)}
								>
									<span
										className={cn(
											"grid size-4 place-items-center rounded-[var(--radius-xs)] ring-1 ring-inset",
											TONE_CLASS[s.tone],
										)}
									>
										<s.icon className="size-2.5" strokeWidth={1.7} />
									</span>
									<span className="text-foreground/90 truncate max-w-[12ch] xs:max-w-[16ch] sm:max-w-[18ch]">
										{s.label}
									</span>
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
