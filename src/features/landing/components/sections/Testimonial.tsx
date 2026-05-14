import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Quote } from "lucide-react";

import { EyebrowTag } from "@/shared/components/EyebrowTag";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Testimonial() {
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
					gsap.from(".testimonial > *", {
						y: 22,
						autoAlpha: 0,
						stagger: 0.1,
						duration: 0.75,
						ease: "power3.out",
						scrollTrigger: {
							trigger: ".testimonial",
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
		<section
			ref={rootRef}
			id="customers"
			className="py-20 sm:py-32 lg:py-40"
		>
			<div className="container mx-auto px-4 sm:px-6">
				<div className="testimonial mx-auto max-w-[860px] flex flex-col items-center text-center gap-8">
					<EyebrowTag>{t("testimonial.eyebrow")}</EyebrowTag>

					<Quote
						className="size-9 text-foreground/15 rtl-flip"
						strokeWidth={1.4}
						aria-hidden="true"
					/>

					<blockquote className="font-semibold tracking-tight leading-[1.2] text-[1.25rem] xs:text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] text-foreground [text-wrap:balance]">
						<span className="text-brand-gradient">"</span>
						{t("testimonial.quote")}
						<span className="text-brand-gradient">"</span>
					</blockquote>

					<div className="flex items-center gap-3 mt-2">
						<div
							aria-hidden="true"
							className="size-11 rounded-full ring-1 ring-inset ring-border"
							style={{
								background:
									"linear-gradient(135deg, oklch(0.7 0.2 285), oklch(0.65 0.18 245))",
							}}
						/>
						<div className="text-start">
							<div className="text-[0.9375rem] font-medium text-foreground">
								{t("testimonial.author")}
							</div>
							<div className="text-[0.8125rem] text-muted-foreground">
								{t("testimonial.role")}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
