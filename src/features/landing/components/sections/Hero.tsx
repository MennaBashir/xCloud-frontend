import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
	CalendarDays,
	CircleCheck,
	FolderClosed,
	Inbox,
	PlayCircle,
	Sparkles,
	Video,
} from "lucide-react";

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
						{[0, 1, 2, 3].map((i) => (
							<div
								key={i}
								className="aspect-[4/3] rounded-[var(--radius-lg)] bg-surface-muted ring-1 ring-inset ring-border relative overflow-hidden"
								style={{
									backgroundImage:
										"radial-gradient(at " +
										[30, 70, 40, 60][i] +
										"% " +
										[30, 60, 70, 40][i] +
										"%, oklch(0.55 0.2 " +
										[285, 245, 162, 25][i] +
										" / 0.4) 0px, transparent 60%)",
								}}
							>
								<span className="absolute bottom-2 start-2 inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 text-[0.6875rem] font-medium">
									{["Priya", "Marcus", "Aisha", "Devon"][i]}
								</span>
							</div>
						))}
					</div>

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

