import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { cn } from "@/lib/utils";
import { EyebrowTag } from "@/shared/components/EyebrowTag";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEPS = ["capture", "decide", "execute"] as const;

export function HowItWorks() {
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

					gsap.from(".how-header > *", {
						y: 16,
						autoAlpha: 0,
						stagger: 0.08,
						duration: 0.65,
						ease: "power3.out",
						scrollTrigger: {
							trigger: ".how-header",
							start: "top 85%",
						},
					});

					gsap.from(".how-step", {
						y: 28,
						autoAlpha: 0,
						stagger: 0.12,
						duration: 0.7,
						ease: "power3.out",
						scrollTrigger: {
							trigger: ".how-steps",
							start: "top 80%",
						},
					});

					// Animate the connector line drawing in
					gsap.fromTo(
						".how-connector-fill",
						{ scaleX: 0, transformOrigin: "left center" },
						{
							scaleX: 1,
							duration: 1.4,
							ease: "power2.inOut",
							scrollTrigger: {
								trigger: ".how-steps",
								start: "top 75%",
							},
						},
					);
				},
			);
			return () => mm.revert();
		},
		{ scope: rootRef },
	);

	return (
		<section
			ref={rootRef}
			id="how-it-works"
			className="relative py-24 sm:py-32 lg:py-40 bg-surface-muted/30 border-y border-border"
		>
			<div className="container mx-auto px-4 sm:px-6">
				<header className="how-header flex flex-col items-center text-center gap-4 max-w-[720px] mx-auto mb-16 sm:mb-20">
					<EyebrowTag>{t("howItWorks.eyebrow")}</EyebrowTag>
					<h2 className="font-semibold tracking-tight leading-[1.08] text-[2rem] sm:text-[2.5rem] lg:text-[3.25rem] text-foreground">
						{t("howItWorks.title")}
					</h2>
					<p className="text-[1rem] sm:text-[1.0625rem] leading-relaxed text-muted-foreground max-w-[55ch]">
						{t("howItWorks.subtitle")}
					</p>
				</header>

				<div className="how-steps relative">
					{/* Connector line (desktop only) */}
					<div
						aria-hidden="true"
						className="hidden lg:block absolute top-[2.75rem] start-[10%] end-[10%] h-px bg-border"
					>
						<div
							className="how-connector-fill h-full"
							style={{
								background:
									"linear-gradient(to right, oklch(0.62 0.19 245), oklch(0.55 0.2 285))",
							}}
						/>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
						{STEPS.map((key, i) => (
							<StepCard key={key} stepKey={key} index={i} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function StepCard({
	stepKey,
	index,
}: {
	stepKey: (typeof STEPS)[number];
	index: number;
}) {
	const { t } = useTranslation("landing");

	return (
		<div className="how-step relative flex flex-col items-center text-center gap-4 px-2">
			{/* Step badge */}
			<div
				className={cn(
					"relative z-10 grid place-items-center size-22 size-[5.5rem] rounded-full",
					"bg-card border border-border",
					"shadow-[0_1px_2px_oklch(0_0_0/0.04),0_12px_24px_-12px_oklch(0_0_0/0.16)]",
				)}
			>
				<span
					className={cn(
						"absolute inset-0 rounded-full",
						"bg-[radial-gradient(circle_at_center,oklch(0.62_0.19_245/0.12),transparent_70%)]",
					)}
				/>
				<span
					className="relative font-mono text-[1.25rem] font-medium tracking-tight"
					style={{
						background:
							index % 2 === 0
								? "linear-gradient(135deg, oklch(0.55 0.2 285), oklch(0.62 0.19 245))"
								: "linear-gradient(135deg, oklch(0.62 0.19 245), oklch(0.55 0.2 285))",
						WebkitBackgroundClip: "text",
						backgroundClip: "text",
						color: "transparent",
					}}
				>
					{t(`howItWorks.steps.${stepKey}.step`)}
				</span>
			</div>

			<h3 className="font-semibold tracking-tight text-[1.375rem] text-foreground mt-2">
				{t(`howItWorks.steps.${stepKey}.title`)}
			</h3>
			<p className="text-[0.9375rem] leading-relaxed text-muted-foreground max-w-[36ch]">
				{t(`howItWorks.steps.${stepKey}.description`)}
			</p>
		</div>
	);
}
