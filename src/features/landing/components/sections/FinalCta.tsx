import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CircleCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EyebrowTag } from "@/shared/components/EyebrowTag";
import { cn } from "@/lib/utils";

import { HeroMagneticCta } from "../hero/HeroMagneticCta";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* FinalCta — light split panel, no dark island.
 *
 * Asymmetric 60/40 split. Copy on the left, AI Recap mini-mockup on the right.
 * Double-Bezel surface, hairline ring, inset highlight. Brand-gradient appears
 * only as a 4px accent line under the H2 (no text-fill gradient).
 */
export function FinalCta() {
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

					gsap.from(".final-cta-anim", {
						y: 24,
						autoAlpha: 0,
						filter: "blur(8px)",
						stagger: 0.12,
						duration: 0.8,
						ease: "power3.out",
						scrollTrigger: {
							trigger: ".final-cta",
							start: "top 75%",
						},
					});

					// Subtle live-dot breath
					gsap.to(".final-cta-pulse", {
						scale: 1.18,
						opacity: 0,
						duration: 2.4,
						ease: "sine.inOut",
						repeat: -1,
						transformOrigin: "center",
					});

					// Brand accent underline draw-in under the headline
					gsap.fromTo(
						".final-cta-underline",
						{ scaleX: 0, transformOrigin: "left center" },
						{
							scaleX: 1,
							duration: 1.1,
							ease: "power3.out",
							scrollTrigger: {
								trigger: ".final-cta",
								start: "top 70%",
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
			id="get-started"
			className="relative py-20 sm:py-32 lg:py-40 scroll-mt-24"
		>
			{/* Ambient mesh */}
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 opacity-90"
				style={{
					background:
						"radial-gradient(at 12% 22%, oklch(0.62 0.19 245 / 0.10) 0px, transparent 50%)," +
						"radial-gradient(at 88% 18%, oklch(0.55 0.2 285 / 0.10) 0px, transparent 55%)," +
						"radial-gradient(at 50% 100%, oklch(0.65 0.16 162 / 0.06) 0px, transparent 60%)",
				}}
			/>

			<div className="container mx-auto px-4 sm:px-6">
				{/* Double-Bezel outer shell */}
				<div
					className={cn(
						"final-cta relative rounded-[2.25rem] p-1.5 sm:p-2",
						"bg-foreground/[0.035] ring-1 ring-inset ring-border",
						"shadow-[0_1px_2px_oklch(0_0_0/0.04),0_40px_80px_-32px_oklch(0_0_0/0.16)]",
					)}
				>
					{/* Inner core */}
					<div
						className={cn(
							"relative overflow-hidden rounded-[calc(2.25rem-0.5rem)]",
							"bg-card border border-border",
							"shadow-[inset_0_1px_0_oklch(1_0_0/0.06)]",
							"p-7 xs:p-10 sm:p-14 lg:p-16",
						)}
					>
						{/* Hairline grid texture */}
						<div
							aria-hidden="true"
							className="absolute inset-0 opacity-[0.04] pointer-events-none"
							style={{
								backgroundImage:
									"linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
								backgroundSize: "56px 56px",
								maskImage:
									"radial-gradient(ellipse at top right, black 20%, transparent 70%)",
							}}
						/>

						<div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-center gap-10 lg:gap-14">
							{/* LEFT: copy */}
							<div className="flex flex-col items-start gap-6">
								<EyebrowTag className="final-cta-anim" tone="ai" withDot>
									{t("finalCta.eyebrow")}
								</EyebrowTag>

								<h2 className="final-cta-anim relative font-semibold tracking-tight leading-[1.06] text-[1.625rem] xs:text-[2rem] sm:text-[2.75rem] lg:text-[3.25rem] text-foreground max-w-[18ch] [text-wrap:balance]">
									{t("finalCta.title")}
									{/* 4px brand-gradient accent line under the H2 */}
									<span
										aria-hidden="true"
										className="final-cta-underline absolute -bottom-2 sm:-bottom-3 start-0 h-1 w-[6rem] sm:w-[8rem] rounded-full"
										style={{
											background:
												"linear-gradient(90deg, oklch(0.62 0.19 245), oklch(0.55 0.2 285))",
										}}
									/>
								</h2>

								<p className="final-cta-anim text-[1rem] sm:text-[1.0625rem] leading-relaxed text-muted-foreground max-w-[52ch] mt-2">
									{t("finalCta.subtitle")}
								</p>

								<div className="final-cta-anim flex flex-col xs:flex-row items-stretch xs:items-center gap-3 mt-1 w-full xs:w-auto max-w-[420px] xs:max-w-none">
									<HeroMagneticCta
										label={t("finalCta.primaryCta")}
										href="/signup"
										className="w-full xs:w-auto"
									/>
									<Button
										asChild
										size="pill"
										variant="ghost"
										className="w-full xs:w-auto justify-center"
									>
										<a href="mailto:sales@sprintifai.com">
											{t("finalCta.secondaryCta")}
										</a>
									</Button>
								</div>
							</div>

							{/* RIGHT: AI Recap demo card — Double-Bezel mini surface */}
							<div className="final-cta-anim relative w-full max-w-[420px] lg:max-w-none ms-auto">
								<div
									className={cn(
										"relative rounded-[1.75rem] p-1.5",
										"bg-foreground/[0.04] ring-1 ring-inset ring-border",
										"shadow-[0_1px_2px_oklch(0_0_0/0.04),0_24px_48px_-24px_oklch(0_0_0/0.18)]",
									)}
								>
									<div
										className={cn(
											"rounded-[calc(1.75rem-0.375rem)] border border-border bg-surface-muted/60",
											"shadow-[inset_0_1px_0_oklch(1_0_0/0.05)]",
											"p-4 sm:p-5 flex flex-col gap-3.5",
										)}
									>
										<div className="flex items-center justify-between">
											<span className="inline-flex items-center gap-1.5 text-[0.625rem] font-medium uppercase tracking-[0.18em] text-ai">
												<Sparkles
													className="size-3 ambient-pulse"
													strokeWidth={1.8}
												/>
												<span>AI Recap · just now</span>
											</span>
											<span className="relative grid size-1.5 place-items-center">
												<span
													aria-hidden="true"
													className="final-cta-pulse absolute inset-0 rounded-full bg-success/55"
												/>
												<span className="relative size-1.5 rounded-full bg-success" />
											</span>
										</div>

										<p className="text-[0.875rem] leading-relaxed text-foreground">
											Team locked the Q3 launch scope. Design review for
											onboarding moved to next week.
										</p>

										<div className="h-px bg-border" />

										<ul className="flex flex-col gap-2">
											{[
												{
													done: true,
													text: "Confirm Q3 launch scope",
													owner: "Priya",
												},
												{
													done: false,
													text: "Schedule design review",
													owner: "Aisha",
												},
												{
													done: false,
													text: "Update pricing tier copy",
													owner: "Devon",
												},
											].map((row, i) => (
												<li
													key={i}
													className="flex items-start gap-2 text-[0.8125rem]"
												>
													<CircleCheck
														className={cn(
															"size-3.5 mt-0.5 shrink-0",
															row.done
																? "text-success"
																: "text-muted-foreground/45",
														)}
														strokeWidth={1.7}
													/>
													<span
														className={cn(
															"flex-1 min-w-0 text-foreground",
															row.done &&
																"text-muted-foreground line-through",
														)}
													>
														{row.text}
													</span>
													<span className="font-mono text-[0.6875rem] text-muted-foreground">
														{row.owner}
													</span>
												</li>
											))}
										</ul>

										<div className="flex items-center justify-between text-[0.6875rem] text-muted-foreground font-mono pt-1">
											<span>3 action items · 2 owners</span>
											<span>00:47</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
