import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

import { Button, ButtonTrailingIcon } from "@/components/ui/button";
import { EyebrowTag } from "@/shared/components/EyebrowTag";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
					gsap.from(".final-cta > *", {
						y: 22,
						autoAlpha: 0,
						stagger: 0.1,
						duration: 0.7,
						ease: "power3.out",
						scrollTrigger: {
							trigger: ".final-cta",
							start: "top 80%",
						},
					});
				},
			);
			return () => mm.revert();
		},
		{ scope: rootRef },
	);

	return (
		<section ref={rootRef} className="relative py-20 sm:py-32 lg:py-40">
			<div className="container mx-auto px-4 sm:px-6">
				<div
					className="final-cta relative overflow-hidden rounded-[var(--radius-3xl)] border border-border bg-[oklch(0.16_0.06_280)] text-white p-7 xs:p-10 sm:p-14 lg:p-20 flex flex-col items-center text-center gap-6 sm:gap-7"
				>
					{/* Mesh */}
					<div
						aria-hidden="true"
						className="absolute inset-0 -z-10 opacity-90"
						style={{
							background: `
								radial-gradient(at 16% 22%, oklch(0.65 0.2 285 / 0.5) 0px, transparent 50%),
								radial-gradient(at 82% 18%, oklch(0.62 0.19 245 / 0.4) 0px, transparent 55%),
								radial-gradient(at 50% 100%, oklch(0.55 0.2 285 / 0.35) 0px, transparent 60%)
							`,
						}}
					/>

					<EyebrowTag className="!border-white/15 !bg-white/8 !text-white/85">
						{t("finalCta.eyebrow")}
					</EyebrowTag>

					<h2 className="font-semibold tracking-tight leading-[1.08] text-[1.625rem] xs:text-[2rem] sm:text-[2.75rem] lg:text-[3.5rem] max-w-[18ch] [text-wrap:balance]">
						{t("finalCta.title")}
					</h2>

					<p className="text-[1rem] sm:text-[1.0625rem] leading-relaxed text-white/75 max-w-[55ch]">
						{t("finalCta.subtitle")}
					</p>

					<div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 mt-2 w-full xs:w-auto max-w-[420px] xs:max-w-none">
						<Button
							asChild
							size="pill"
							className="group/btn bg-white text-foreground hover:bg-white/95 w-full xs:w-auto justify-center"
						>
							<Link to="/signup">
								<span>{t("finalCta.primaryCta")}</span>
								<ButtonTrailingIcon className="!bg-foreground/8">
									<ArrowRight
										className="rtl-flip"
										strokeWidth={1.8}
									/>
								</ButtonTrailingIcon>
							</Link>
						</Button>
						<Button
							asChild
							size="pill"
							variant="ghost"
							className="text-white hover:bg-white/10 w-full xs:w-auto justify-center"
						>
							<a href="mailto:sales@sprintifai.com">
								{t("finalCta.secondaryCta")}
							</a>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
