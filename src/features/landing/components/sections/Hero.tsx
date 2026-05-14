import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
	ArrowRight,
	CalendarDays,
	CircleCheck,
	FolderClosed,
	Inbox,
	PlayCircle,
	Sparkles,
	Video,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, ButtonTrailingIcon } from "@/components/ui/button";
import { EyebrowTag } from "@/shared/components/EyebrowTag";

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
								y: 24,
								autoAlpha: 0,
								duration: 0.7,
								stagger: 0.08,
							},
							"-=0.25",
						)
						.from(
							".hero-subtitle",
							{ y: 14, autoAlpha: 0, duration: 0.55 },
							"-=0.4",
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
							{ autoAlpha: 0, duration: 0.5 },
							"-=0.3",
						)
						.from(
							".hero-mockup",
							{
								y: 32,
								autoAlpha: 0,
								duration: 0.9,
								ease: "power4.out",
							},
							"-=0.55",
						)
						.from(
							".hero-mockup-card",
							{
								y: 16,
								autoAlpha: 0,
								duration: 0.6,
								stagger: 0.08,
							},
							"-=0.55",
						);

					// Continuous gentle float on the mockup
					gsap.to(".hero-mockup-floater", {
						y: -10,
						duration: 4,
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
			className="relative isolate overflow-hidden pt-28 pb-16 xs:pt-32 xs:pb-20 sm:pt-40 sm:pb-28 lg:pt-44 lg:pb-32"
		>
			{/* Background mesh */}
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10"
				style={{
					background: `
						radial-gradient(at 18% 12%, oklch(0.62 0.19 245 / 0.18) 0px, transparent 50%),
						radial-gradient(at 82% 8%, oklch(0.55 0.2 285 / 0.14) 0px, transparent 50%),
						radial-gradient(at 50% 100%, oklch(0.65 0.16 162 / 0.08) 0px, transparent 60%)
					`,
				}}
			/>
			{/* Hairline grid overlay */}
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 opacity-[0.04]"
				style={{
					backgroundImage:
						"linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
					backgroundSize: "60px 60px",
					maskImage:
						"radial-gradient(ellipse at top, black 30%, transparent 75%)",
				}}
			/>

			<div className="container mx-auto px-4 sm:px-6">
				<div className="max-w-[820px] mx-auto text-center flex flex-col items-center gap-6">
					<div className="hero-eyebrow">
						<EyebrowTag withDot tone="ai">
							{t("hero.eyebrow")}
						</EyebrowTag>
					</div>

					<h1 className="font-semibold tracking-tight leading-[1.05] text-[2.125rem] xs:text-[2.75rem] sm:text-[3.5rem] lg:text-[4.5rem] text-foreground [text-wrap:balance]">
						<span className="hero-title-line block">
							{t("hero.title.part1")}
						</span>
						<span className="hero-title-line block">
							<span className="text-brand-gradient">
								{t("hero.title.part2")}
							</span>
						</span>
					</h1>

					<p className="hero-subtitle max-w-[60ch] text-[1rem] sm:text-[1.0625rem] leading-relaxed text-muted-foreground">
						{t("hero.subtitle")}
					</p>

					<div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 mt-2 w-full xs:w-auto max-w-[420px] xs:max-w-none">
						<Button
							asChild
							size="pill"
							variant="brand"
							className="hero-cta group/btn w-full xs:w-auto justify-center"
						>
							<Link to="/signup">
								<span>{t("hero.primaryCta")}</span>
								<ButtonTrailingIcon>
									<ArrowRight className="rtl-flip" strokeWidth={1.8} />
								</ButtonTrailingIcon>
							</Link>
						</Button>
						<Button
							asChild
							size="pill"
							variant="outline"
							className="hero-cta group/btn w-full xs:w-auto justify-center"
						>
							<a href="#how-it-works">
								<PlayCircle
									className="size-4 text-ai"
									strokeWidth={1.6}
								/>
								<span>{t("hero.secondaryCta")}</span>
							</a>
						</Button>
					</div>

					<p className="hero-trust mt-2 text-[0.8125rem] text-muted-foreground">
						{t("hero.trust")}
					</p>
				</div>

				{/* Product mockup */}
				<div className="hero-mockup hero-mockup-floater mt-12 sm:mt-20 mx-auto max-w-[1080px]">
					<div
						className={cn(
							"relative rounded-[var(--radius-3xl)]",
							"bg-surface-muted/60 ring-1 ring-inset ring-border",
							"p-2 sm:p-2.5",
							"shadow-[0_1px_2px_oklch(0_0_0/0.04),0_40px_80px_-30px_oklch(0_0_0/0.18)]",
						)}
					>
						{/* Glow under the mockup */}
						<div
							aria-hidden="true"
							className="absolute -inset-x-20 -bottom-20 -z-10 h-40 opacity-50 blur-3xl"
							style={{
								background:
									"radial-gradient(ellipse at center, oklch(0.62 0.19 245 / 0.35), transparent 70%)",
							}}
						/>

						<MockupCore />
					</div>
				</div>
			</div>
		</section>
	);
}

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
				"rounded-[calc(var(--radius-3xl)-0.625rem)] bg-card border border-border overflow-hidden",
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
			</div>

			{/* Body grid */}
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

					{/* Video tiles grid */}
					<div className="grid grid-cols-2 gap-2.5">
						{[0, 1, 2, 3].map((i) => (
							<div
								key={i}
								className="hero-mockup-card aspect-[4/3] rounded-[var(--radius-lg)] bg-surface-muted ring-1 ring-inset ring-border relative overflow-hidden"
								style={{
									backgroundImage: `radial-gradient(at ${
										[30, 70, 40, 60][i]
									}% ${[30, 60, 70, 40][i]}%, oklch(0.55 0.2 ${
										[285, 245, 162, 25][i]
									} / 0.4) 0px, transparent 60%)`,
								}}
							>
								<span className="absolute bottom-2 start-2 inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 text-[0.6875rem] font-medium">
									{["Priya", "Marcus", "Aisha", "Devon"][i]}
								</span>
							</div>
						))}
					</div>

					{/* Caption bar */}
					<div className="hero-mockup-card mt-4 rounded-[var(--radius-md)] border border-border bg-surface-muted/60 px-3 py-2.5 flex items-start gap-2">
						<Sparkles
							className="size-3.5 mt-0.5 text-ai shrink-0"
							strokeWidth={1.6}
						/>
						<p className="text-[0.8125rem] leading-relaxed text-foreground">
							<span className="text-muted-foreground">Priya:</span>{" "}
							Let's lock the launch scope before Friday and assign
							the design review to Aisha.
						</p>
					</div>
				</div>

				{/* Right: AI summary panel */}
				<div className="p-3 sm:p-5 flex flex-col gap-4 bg-surface-muted/30">
					<div className="hero-mockup-card flex items-center justify-between">
						<span className="inline-flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ai">
							<Sparkles className="size-3" strokeWidth={1.8} />
							AI Summary
						</span>
						<span className="text-[0.6875rem] text-muted-foreground font-mono">
							2 min ago
						</span>
					</div>

					<div className="hero-mockup-card text-[0.875rem] leading-relaxed text-foreground">
						Team agreed to lock Q3 launch scope by Friday. Design
						review for onboarding moved to next week.
					</div>

					<div className="hero-mockup-card flex flex-col gap-1.5">
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

					<div className="hero-mockup-card mt-auto grid grid-cols-2 gap-2">
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


