import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const LOGOS = [
	"Northwave",
	"Helio Labs",
	"Quantica",
	"Brightside",
	"Foundry",
	"Mercator",
	"Atlasware",
];

export function LogosStrip() {
	const { t } = useTranslation("landing");
	const rootRef = useRef<HTMLDivElement>(null);

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
					gsap.to(".logos-track", {
						xPercent: -50,
						duration: 32,
						ease: "none",
						repeat: -1,
					});
				},
			);
			return () => mm.revert();
		},
		{ scope: rootRef },
	);

	const track = (
		<>
			{LOGOS.map((logo, i) => (
				<span
					key={`${logo}-${i}`}
					className={cn(
						"inline-flex items-center shrink-0 px-6 py-2",
						"text-[1.125rem] font-semibold tracking-tight",
						"text-muted-foreground/70 hover:text-foreground transition-colors",
					)}
					style={{ fontFamily: "var(--font-display)" }}
				>
					{logo}
				</span>
			))}
		</>
	);

	return (
		<section ref={rootRef} className="py-16 sm:py-20 border-y border-border bg-surface-muted/40">
			<div className="container mx-auto px-4 sm:px-6">
				<p className="text-center text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-8">
					{t("logos.label")}
				</p>

				<div
					className="overflow-hidden"
					style={{
						maskImage:
							"linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
					}}
				>
					<div className="logos-track flex w-max items-center">
						{track}
						{track}
					</div>
				</div>
			</div>
		</section>
	);
}
