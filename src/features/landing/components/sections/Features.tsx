import { useRef, type ComponentType, type SVGProps } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
	CalendarDays,
	Check,
	FolderClosed,
	Inbox,
	Sparkles,
	Video,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { EyebrowTag } from "@/shared/components/EyebrowTag";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type FeatureKey = "meeting" | "chat" | "calendar" | "files" | "gmail";

type FeatureDef = {
	key: FeatureKey;
	icon: ComponentType<SVGProps<SVGSVGElement>>;
	tone: "ai" | "indigo" | "emerald" | "amber" | "rose";
	visual: ComponentType;
};

const FEATURES: FeatureDef[] = [
	{
		key: "meeting",
		icon: Video,
		tone: "indigo",
		visual: MeetingVisual,
	},
	{
		key: "chat",
		icon: Sparkles,
		tone: "ai",
		visual: ChatVisual,
	},
	{
		key: "calendar",
		icon: CalendarDays,
		tone: "emerald",
		visual: CalendarVisual,
	},
	{
		key: "files",
		icon: FolderClosed,
		tone: "amber",
		visual: FilesVisual,
	},
	{
		key: "gmail",
		icon: Inbox,
		tone: "rose",
		visual: GmailVisual,
	},
];

export function Features() {
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

					// Section header reveal
					gsap.from(".features-header > *", {
						y: 16,
						autoAlpha: 0,
						duration: 0.7,
						stagger: 0.08,
						ease: "power3.out",
						scrollTrigger: {
							trigger: ".features-header",
							start: "top 85%",
						},
					});

					// Each row reveal
					gsap.utils
						.toArray<HTMLElement>(".feature-row")
						.forEach((row) => {
							gsap.from(row.querySelectorAll(".feature-anim"), {
								y: 22,
								autoAlpha: 0,
								duration: 0.7,
								stagger: 0.1,
								ease: "power3.out",
								scrollTrigger: {
									trigger: row,
									start: "top 80%",
								},
							});
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
			id="features"
			className="relative py-20 sm:py-32 lg:py-40"
		>
			<div className="container mx-auto px-4 sm:px-6">
				<header className="features-header flex flex-col items-center text-center gap-4 max-w-[760px] mx-auto mb-12 sm:mb-24">
					<EyebrowTag>{t("features.eyebrow")}</EyebrowTag>
					<h2 className="font-semibold tracking-tight leading-[1.1] text-[1.75rem] xs:text-[2rem] sm:text-[2.5rem] lg:text-[3.25rem] text-foreground [text-wrap:balance]">
						{t("features.sectionTitle")}
					</h2>
					<p className="text-[1rem] sm:text-[1.0625rem] leading-relaxed text-muted-foreground max-w-[60ch]">
						{t("features.sectionSubtitle")}
					</p>
				</header>

				<div className="flex flex-col gap-14 xs:gap-20 sm:gap-32 lg:gap-40">
					{FEATURES.map((feature, i) => {
						const reverse = i % 2 === 1;
						const Icon = feature.icon;
						const Visual = feature.visual;
						const bullets = [
							t(`features.${feature.key}.bullets.a`),
							t(`features.${feature.key}.bullets.b`),
							t(`features.${feature.key}.bullets.c`),
						];

						return (
							<article
								key={feature.key}
								className={cn(
									"feature-row grid grid-cols-1 lg:grid-cols-2 items-center gap-8 sm:gap-14",
									reverse && "lg:[&>div:first-child]:order-2",
								)}
							>
								{/* Copy */}
								<div className="feature-anim flex flex-col gap-5 max-w-[520px]">
									<div className="inline-flex items-center gap-2 self-start">
										<span
											className={cn(
												"inline-flex items-center justify-center size-7 rounded-[var(--radius-sm)]",
												feature.tone === "ai" &&
													"bg-ai-tint text-ai ring-1 ring-inset ring-ai/20",
												feature.tone === "indigo" &&
													"bg-[oklch(0.55_0.2_285/0.12)] text-[oklch(0.55_0.2_285)] ring-1 ring-inset ring-[oklch(0.55_0.2_285/0.25)]",
												feature.tone === "emerald" &&
													"bg-[oklch(0.65_0.16_162/0.12)] text-success ring-1 ring-inset ring-success/25",
												feature.tone === "amber" &&
													"bg-[oklch(0.82_0.15_75/0.16)] text-warning ring-1 ring-inset ring-warning/25",
												feature.tone === "rose" &&
													"bg-[oklch(0.68_0.2_27/0.12)] text-destructive ring-1 ring-inset ring-destructive/25",
											)}
										>
											<Icon className="size-3.5" strokeWidth={1.7} />
										</span>
										<span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
											{t(`features.${feature.key}.eyebrow`)}
										</span>
									</div>

									<h3 className="font-semibold tracking-tight leading-[1.1] text-[1.5rem] xs:text-[1.75rem] sm:text-[2rem] lg:text-[2.5rem] text-foreground [text-wrap:balance]">
										{t(`features.${feature.key}.title`)}
									</h3>

									<p className="text-[1rem] sm:text-[1.0625rem] leading-relaxed text-muted-foreground">
										{t(`features.${feature.key}.description`)}
									</p>

									<ul className="flex flex-col gap-2.5 mt-2">
										{bullets.map((b) => (
											<li
												key={b}
												className="flex items-start gap-2.5 text-[0.9375rem] text-foreground"
											>
												<span
													className={cn(
														"mt-0.5 grid size-5 place-items-center rounded-full shrink-0",
														"bg-foreground/5 text-foreground",
													)}
												>
													<Check
														className="size-3"
														strokeWidth={2}
													/>
												</span>
												<span className="leading-relaxed">
													{b}
												</span>
											</li>
										))}
									</ul>
								</div>

								{/* Visual */}
								<div className="feature-anim">
									<FeatureBezel tone={feature.tone}>
										<Visual />
									</FeatureBezel>
								</div>
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
}

function FeatureBezel({
	children,
	tone,
}: {
	children: React.ReactNode;
	tone: FeatureDef["tone"];
}) {
	const glowColor =
		tone === "ai"
			? "oklch(0.62 0.19 245 / 0.18)"
			: tone === "indigo"
				? "oklch(0.55 0.2 285 / 0.18)"
				: tone === "emerald"
					? "oklch(0.65 0.16 162 / 0.16)"
					: tone === "amber"
						? "oklch(0.82 0.15 75 / 0.18)"
						: "oklch(0.68 0.2 27 / 0.16)";

	return (
		<div
			className={cn(
				"relative rounded-[var(--radius-3xl)]",
				"bg-surface-muted/60 ring-1 ring-inset ring-border p-2 sm:p-2.5",
				"shadow-[0_1px_2px_oklch(0_0_0/0.04),0_32px_64px_-32px_oklch(0_0_0/0.16)]",
			)}
		>
			<div
				aria-hidden="true"
				className="absolute -inset-x-10 -bottom-10 -z-10 h-32 opacity-60 blur-3xl"
				style={{
					background: `radial-gradient(ellipse at center, ${glowColor}, transparent 70%)`,
				}}
			/>
			<div
				className={cn(
					"rounded-[calc(var(--radius-3xl)-0.625rem)]",
					"bg-card border border-border overflow-hidden",
					"shadow-[inset_0_1px_0_oklch(1_0_0/0.06)]",
					"min-h-[280px] xs:min-h-[320px] sm:min-h-[400px]",
				)}
			>
				{children}
			</div>
		</div>
	);
}

/* ─── Per-feature visual mockups ─────────────────────────────────────── */

function MeetingVisual() {
	return (
		<div className="p-4 sm:p-5 h-full flex flex-col gap-4">
			<div className="grid grid-cols-2 gap-2.5">
				{[0, 1, 2, 3].map((i) => (
					<div
						key={i}
						className="aspect-[4/3] rounded-[var(--radius-md)] bg-surface-muted ring-1 ring-inset ring-border relative overflow-hidden"
						style={{
							backgroundImage: `radial-gradient(at ${
								[30, 70, 40, 60][i]
							}% ${[30, 60, 70, 40][i]}%, oklch(0.55 0.2 ${
								[285, 245, 162, 25][i]
							} / 0.4) 0px, transparent 60%)`,
						}}
					>
						<span className="absolute bottom-1.5 start-1.5 inline-flex items-center gap-1.5 rounded-full bg-black/60 text-white px-1.5 py-0.5 text-[0.6875rem] font-medium">
							{["Priya", "Marcus", "Aisha", "Devon"][i]}
						</span>
					</div>
				))}
			</div>
			<div className="rounded-[var(--radius-md)] border border-border bg-surface-muted/60 px-3 py-2.5">
				<p className="text-[0.8125rem] leading-relaxed">
					<span className="text-muted-foreground">Live transcript:</span>{" "}
					Let's lock the launch scope before Friday.
				</p>
			</div>
		</div>
	);
}

function ChatVisual() {
	return (
		<div className="p-4 sm:p-5 h-full flex flex-col gap-3">
			<div className="flex items-start gap-3">
				<div className="size-7 rounded-full bg-surface-muted shrink-0" />
				<div className="rounded-2xl bg-surface-muted/60 px-3.5 py-2.5 text-[0.875rem]">
					What did we decide about the Q3 launch?
				</div>
			</div>
			<div className="flex items-start gap-3 ms-auto flex-row-reverse">
				<div className="size-7 rounded-full bg-ai-tint text-ai grid place-items-center shrink-0">
					<Sparkles className="size-3.5" strokeWidth={1.6} />
				</div>
				<div className="rounded-2xl bg-ai-tint text-foreground px-3.5 py-3 text-[0.875rem] leading-relaxed max-w-[85%]">
					Lock scope by Friday. Design review moved to next week.
					<div className="mt-2 pt-2 border-t border-ai/15 text-[0.75rem] text-muted-foreground">
						Source: Sprint planning · 12:47
					</div>
				</div>
			</div>
		</div>
	);
}

function CalendarVisual() {
	const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
	return (
		<div className="p-4 sm:p-5 h-full">
			<div className="grid grid-cols-5 gap-1.5 sm:gap-2 h-full">
				{days.map((day, i) => (
					<div key={day} className="flex flex-col gap-2 min-w-0">
						<div className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground text-center">
							{day}
						</div>
						<div className="flex-1 rounded-[var(--radius-sm)] border border-border bg-surface-muted/40 p-1 sm:p-1.5 flex flex-col gap-1 min-w-0">
							{i === 1 ? (
								<div className="rounded-[var(--radius-xs)] bg-success/15 border border-success/30 px-1 sm:px-1.5 py-1 text-[0.625rem] sm:text-[0.6875rem] text-success font-medium truncate">
									Standup
								</div>
							) : null}
							{i === 2 ? (
								<>
									<div className="rounded-[var(--radius-xs)] bg-ai-tint border border-ai/25 px-1 sm:px-1.5 py-1 text-[0.625rem] sm:text-[0.6875rem] text-ai font-medium truncate">
										Sprint planning
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
}

function FilesVisual() {
	const rows = [
		{ name: "Sprint planning · transcript", size: "284 KB", type: "TXT" },
		{ name: "Roadmap deck Q3", size: "4.2 MB", type: "PDF" },
		{ name: "Onboarding revamp brief", size: "112 KB", type: "MD" },
		{ name: "Launch checklist", size: "38 KB", type: "MD" },
		{ name: "Customer interviews recap", size: "1.8 MB", type: "PDF" },
	];
	return (
		<div className="p-4 sm:p-5 h-full flex flex-col gap-2">
			<div className="hidden xs:grid grid-cols-[1fr_auto_auto] gap-3 px-3 py-2 text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
				<span>Name</span>
				<span>Size</span>
				<span>Type</span>
			</div>
			{rows.map((r) => (
				<div
					key={r.name}
					className="grid grid-cols-[1fr_auto] xs:grid-cols-[1fr_auto_auto] gap-2 xs:gap-3 items-center px-3 py-2 sm:py-2.5 rounded-[var(--radius-md)] border border-border bg-surface-muted/40 text-[0.8125rem] sm:text-[0.875rem] min-w-0"
				>
					<span className="truncate text-foreground min-w-0">{r.name}</span>
					<span className="hidden xs:inline font-mono text-[0.75rem] text-muted-foreground">
						{r.size}
					</span>
					<span className="inline-flex items-center justify-center w-9 sm:w-10 shrink-0 rounded-[var(--radius-xs)] bg-card border border-border text-[0.6875rem] font-medium text-muted-foreground">
						{r.type}
					</span>
				</div>
			))}
		</div>
	);
}

function GmailVisual() {
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
			unread: true,
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
		<div className="p-4 sm:p-5 h-full flex flex-col gap-2">
			{threads.map((tr) => (
				<div
					key={tr.subject}
					className="rounded-[var(--radius-md)] border border-border bg-surface-muted/40 px-3.5 py-3 flex flex-col gap-1.5"
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
					<div className="flex items-start gap-1.5 text-[0.75rem] text-ai">
						<Sparkles className="size-3 shrink-0 mt-0.5" strokeWidth={1.7} />
						<span className="text-muted-foreground line-clamp-1">
							{tr.summary}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}
