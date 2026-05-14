import { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import {
	ArrowUp,
	Calendar,
	CircleCheck,
	Clock,
	Cpu,
	Sparkles,
	Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { EyebrowTag } from "@/shared/components/EyebrowTag";

/* ──────────────────────────────────────────────────────────────────────────
 * Motion Bento — three perpetual archetypes
 *
 * Each card is an isolated, memoised leaf component so re-renders inside one
 * card never propagate to the section root. Spring physics throughout
 * (stiffness 100 / damping 20). Reduced-motion users get static fallbacks.
 * ──────────────────────────────────────────────────────────────────────── */

export function MotionBento() {
	const { t } = useTranslation("landing");

	return (
		<section
			id="motion-bento"
			className="relative py-20 sm:py-32 lg:py-40 border-b border-border scroll-mt-24"
		>
			<div className="container mx-auto px-4 sm:px-6">
				<header className="flex flex-col items-center text-center gap-4 max-w-[760px] mx-auto mb-12 sm:mb-20">
					<EyebrowTag>{t("motionBento.eyebrow")}</EyebrowTag>
					<h2 className="font-semibold tracking-tight leading-[1.1] text-[1.75rem] xs:text-[2rem] sm:text-[2.5rem] lg:text-[3.25rem] text-foreground [text-wrap:balance]">
						{t("motionBento.title")}
					</h2>
					<p className="text-[1rem] sm:text-[1.0625rem] leading-relaxed text-muted-foreground max-w-[60ch]">
						{t("motionBento.subtitle")}
					</p>
				</header>

				{/*
				  Bento grid:
				  - Mobile: stack
				  - sm: Intelligent List (full) + Command Input + Live Status (split)
				  - lg: 3 cols — Intelligent List spans 1, Command spans 1, Live spans 1
				*/}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
					<IntelligentListCard className="sm:col-span-2 lg:col-span-1 lg:row-span-1" />
					<CommandInputCard />
					<LiveStatusCard />
				</div>
			</div>
		</section>
	);
}

/* ════════════════════════════════════════════════════════════════════════════
 * Card 1 — Intelligent List (layoutId re-order loop)
 * ════════════════════════════════════════════════════════════════════════════ */

type Task = {
	id: string;
	title: string;
	priority: "P0" | "P1" | "P2";
	owner: string;
};

const INITIAL_TASKS: Task[] = [
	{ id: "t1", title: "Lock Q3 launch scope", priority: "P0", owner: "Priya" },
	{ id: "t2", title: "Schedule design review", priority: "P1", owner: "Aisha" },
	{ id: "t3", title: "Update pricing tier copy", priority: "P1", owner: "Devon" },
	{ id: "t4", title: "Send roadmap deck", priority: "P2", owner: "Marcus" },
];

const IntelligentListCard = memo(function IntelligentListCard({
	className,
}: {
	className?: string;
}) {
	const { t } = useTranslation("landing");
	const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

	useEffect(() => {
		const id = window.setInterval(() => {
			setTasks((current) => {
				// Promote the last item to the top — simulates AI re-prioritisation
				const next = [...current];
				const tail = next.pop();
				if (tail) next.unshift(tail);
				return next;
			});
		}, 2600);
		return () => window.clearInterval(id);
	}, []);

	return (
		<BentoShell
			className={className}
			label={t("motionBento.list.label")}
			title={t("motionBento.list.title")}
			description={t("motionBento.list.description")}
			icon={Cpu}
		>
			<ul className="flex flex-col gap-1.5 pb-1">
				<AnimatePresence initial={false}>
					{tasks.map((task) => (
						<motion.li
							key={task.id}
							layout
							layoutId={task.id}
							initial={{ opacity: 0, y: -8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 8 }}
							transition={{
								type: "spring",
								stiffness: 130,
								damping: 22,
								mass: 0.6,
							}}
							className={cn(
								"flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-md)]",
								"bg-surface-muted/40 border border-border/60",
							)}
						>
							<PriorityChip priority={task.priority} />
							<span className="flex-1 text-[0.8125rem] text-foreground truncate">
								{task.title}
							</span>
							<span className="text-[0.6875rem] text-muted-foreground font-mono">
								{task.owner}
							</span>
						</motion.li>
					))}
				</AnimatePresence>
			</ul>
		</BentoShell>
	);
});

function PriorityChip({ priority }: { priority: Task["priority"] }) {
	const tone =
		priority === "P0"
			? "text-destructive bg-destructive/12 ring-destructive/25"
			: priority === "P1"
				? "text-warning bg-warning/12 ring-warning/25"
				: "text-muted-foreground bg-surface-muted ring-border";
	return (
		<span
			className={cn(
				"inline-grid place-items-center w-7 h-5 rounded-full ring-1 ring-inset shrink-0",
				"text-[0.625rem] font-mono font-semibold tabular-nums",
				tone,
			)}
		>
			{priority}
		</span>
	);
}

/* ════════════════════════════════════════════════════════════════════════════
 * Card 2 — Command Input (typewriter cycle)
 * ════════════════════════════════════════════════════════════════════════════ */

const PROMPTS = [
	"What did we agree on for the Q3 launch?",
	"Summarise yesterday's design review.",
	"Who owns the pricing-page rewrite?",
	"Draft a recap for the eng all-hands.",
];

const CommandInputCard = memo(function CommandInputCard() {
	const { t } = useTranslation("landing");
	const [text, setText] = useState("");
	const [promptIdx, setPromptIdx] = useState(0);
	const [phase, setPhase] = useState<"typing" | "thinking" | "deleting">(
		"typing",
	);

	useEffect(() => {
		const current = PROMPTS[promptIdx];
		let timeoutId: number | undefined;

		if (phase === "typing") {
			if (text.length < current.length) {
				timeoutId = window.setTimeout(
					() => setText(current.slice(0, text.length + 1)),
					38 + Math.random() * 32,
				);
			} else {
				timeoutId = window.setTimeout(() => setPhase("thinking"), 1400);
			}
		} else if (phase === "thinking") {
			timeoutId = window.setTimeout(() => setPhase("deleting"), 1600);
		} else if (phase === "deleting") {
			if (text.length > 0) {
				timeoutId = window.setTimeout(
					() => setText(current.slice(0, text.length - 1)),
					18,
				);
			} else {
				setPromptIdx((p) => (p + 1) % PROMPTS.length);
				setPhase("typing");
			}
		}

		return () => {
			if (timeoutId !== undefined) window.clearTimeout(timeoutId);
		};
	}, [text, phase, promptIdx]);

	return (
		<BentoShell
			label={t("motionBento.command.label")}
			title={t("motionBento.command.title")}
			description={t("motionBento.command.description")}
			icon={Sparkles}
		>
			<div className="flex flex-col gap-3">
				{/* Input pill */}
				<div
					className={cn(
						"relative flex items-center gap-2.5 px-3.5 py-3 rounded-[var(--radius-lg)]",
						"bg-surface-muted/40 border border-border/60",
					)}
				>
					<Sparkles
						className="size-3.5 text-ai shrink-0"
						strokeWidth={1.7}
					/>
					<div className="flex-1 min-w-0 flex items-center text-[0.8125rem] text-foreground">
						<span className="truncate">{text}</span>
						<span
							aria-hidden="true"
							className="inline-block w-[2px] h-3.5 ms-0.5 bg-ai animate-pulse"
							style={{ animationDuration: "1.1s" }}
						/>
					</div>
				</div>

				{/* Shimmering response area */}
				<AnimatePresence mode="wait">
					{phase === "thinking" ? (
						<motion.div
							key="thinking"
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -6 }}
							transition={{ type: "spring", stiffness: 140, damping: 22 }}
							className="flex flex-col gap-1.5"
						>
							<ShimmerLine width="92%" />
							<ShimmerLine width="78%" />
							<ShimmerLine width="64%" />
						</motion.div>
					) : phase === "typing" || phase === "deleting" ? (
						<motion.div
							key="answer"
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -6 }}
							transition={{ type: "spring", stiffness: 140, damping: 22 }}
							className={cn(
								"rounded-[var(--radius-md)] border border-ai/20 bg-ai-tint",
								"px-3 py-2.5 text-[0.8125rem] leading-relaxed text-foreground",
							)}
						>
							<span className="text-muted-foreground">Answer ·</span>{" "}
							Locked scope by Friday. Owner: Priya. Source:{" "}
							<span className="text-ai">Sprint planning · 12:47</span>
						</motion.div>
					) : null}
				</AnimatePresence>

				<div className="flex items-center justify-between text-[0.6875rem] text-muted-foreground font-mono">
					<span>4 sources cited</span>
					<span className="inline-flex items-center gap-1">
						<ArrowUp className="size-3" strokeWidth={2} /> Send
					</span>
				</div>
			</div>
		</BentoShell>
	);
});

function ShimmerLine({ width }: { width: string }) {
	return (
		<div
			className="h-3 rounded-full overflow-hidden bg-surface-muted relative"
			style={{ width }}
		>
			<motion.div
				aria-hidden="true"
				className="absolute inset-y-0 w-1/3"
				style={{
					background:
						"linear-gradient(90deg, transparent, oklch(0.62 0.19 245 / 0.35), transparent)",
				}}
				initial={{ x: "-100%" }}
				animate={{ x: "350%" }}
				transition={{
					duration: 1.4,
					ease: "easeInOut",
					repeat: Infinity,
				}}
			/>
		</div>
	);
}

/* ════════════════════════════════════════════════════════════════════════════
 * Card 3 — Live Status (breathing dot + overshoot badge)
 * ════════════════════════════════════════════════════════════════════════════ */

const LiveStatusCard = memo(function LiveStatusCard() {
	const { t } = useTranslation("landing");
	const [badgeOn, setBadgeOn] = useState(false);
	const tickRef = useRef(0);

	useEffect(() => {
		const id = window.setInterval(() => {
			tickRef.current += 1;
			setBadgeOn((v) => !v);
		}, 3200);
		return () => window.clearInterval(id);
	}, []);

	return (
		<BentoShell
			label={t("motionBento.live.label")}
			title={t("motionBento.live.title")}
			description={t("motionBento.live.description")}
			icon={Calendar}
		>
			<div className="flex flex-col gap-2.5">
				{/* "Now" row — breathing dot */}
				<div
					className={cn(
						"flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]",
						"border border-success/25 bg-success/8",
					)}
				>
					<span className="relative grid size-2 place-items-center">
						<motion.span
							aria-hidden="true"
							className="absolute inset-0 rounded-full bg-success/50"
							animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
							transition={{
								duration: 2.4,
								ease: "easeInOut",
								repeat: Infinity,
							}}
						/>
						<span className="relative size-2 rounded-full bg-success" />
					</span>
					<div className="flex-1 min-w-0">
						<div className="text-[0.8125rem] font-medium text-foreground">
							Sprint planning
						</div>
						<div className="text-[0.6875rem] text-muted-foreground font-mono flex items-center gap-1.5">
							<Clock className="size-3" strokeWidth={1.6} />
							<span>Now · 47 min left</span>
						</div>
					</div>
					<AnimatePresence>
						{badgeOn ? (
							<motion.span
								key={`badge-${tickRef.current}`}
								initial={{ scale: 0.6, opacity: 0, y: -4 }}
								animate={{ scale: 1, opacity: 1, y: 0 }}
								exit={{ scale: 0.85, opacity: 0, y: -2 }}
								transition={{
									type: "spring",
									stiffness: 320,
									damping: 14,
									mass: 0.5,
								}}
								className={cn(
									"inline-flex items-center gap-1 rounded-full px-2 py-0.5",
									"bg-ai text-ai-foreground text-[0.625rem] font-medium",
									"shadow-[0_1px_2px_oklch(0_0_0/0.12)]",
								)}
							>
								<Sparkles className="size-2.5" strokeWidth={2} />
								<span>Recap ready</span>
							</motion.span>
						) : null}
					</AnimatePresence>
				</div>

				{/* Upcoming */}
				<div className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] border border-border/60 bg-surface-muted/40">
					<span className="size-2 rounded-full bg-foreground/30" />
					<div className="flex-1 min-w-0">
						<div className="text-[0.8125rem] font-medium text-foreground">
							Design review · Onboarding
						</div>
						<div className="text-[0.6875rem] text-muted-foreground font-mono flex items-center gap-1.5">
							<Clock className="size-3" strokeWidth={1.6} />
							<span>14:00 · 6 attending</span>
						</div>
					</div>
					<Users
						className="size-3.5 text-muted-foreground"
						strokeWidth={1.6}
					/>
				</div>

				<div className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] border border-border/60 bg-surface-muted/40">
					<CircleCheck
						className="size-3.5 text-muted-foreground/60"
						strokeWidth={1.6}
					/>
					<div className="flex-1 min-w-0">
						<div className="text-[0.8125rem] font-medium text-foreground line-through text-muted-foreground">
							Standup
						</div>
						<div className="text-[0.6875rem] text-muted-foreground font-mono">
							Ended 11:14
						</div>
					</div>
				</div>
			</div>
		</BentoShell>
	);
});

/* ════════════════════════════════════════════════════════════════════════════
 * Shared shell — label outside, content inside (per directive section 9)
 * ════════════════════════════════════════════════════════════════════════════ */

function BentoShell({
	className,
	label,
	title,
	description,
	icon: Icon,
	children,
}: {
	className?: string;
	label: string;
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
	children: React.ReactNode;
}) {
	const shellRef = useRef<HTMLDivElement>(null);

	// Spotlight border — mousemove only mutates CSS vars on the element.
	// Zero React state, zero re-renders.
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
		<article className={cn("flex flex-col gap-4", className)}>
			{/* Outer shell — Double-Bezel */}
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
				{/* Inner core — concentric radius */}
				<div
					className={cn(
						"rounded-[calc(2rem-0.375rem)] border border-border/70 bg-card",
						"shadow-[inset_0_1px_0_oklch(1_0_0/0.05)]",
						"p-5 sm:p-6",
						"min-h-[260px]",
						"flex flex-col",
					)}
				>
					<div className="flex items-center gap-2 mb-4">
						<span className="grid size-7 place-items-center rounded-[var(--radius-sm)] bg-ai-tint text-ai ring-1 ring-inset ring-ai/20">
							<Icon className="size-3.5" strokeWidth={1.7} />
						</span>
						<span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
							{label}
						</span>
					</div>
					<div className="flex-1 min-h-0">{children}</div>
				</div>
			</div>

			{/* Label block — outside and below, per directive */}
			<div className="px-1 flex flex-col gap-1.5">
				<h3 className="font-semibold tracking-tight text-[1.0625rem] text-foreground">
					{title}
				</h3>
				<p className="text-[0.875rem] text-muted-foreground leading-relaxed max-w-[42ch]">
					{description}
				</p>
			</div>
		</article>
	);
}

