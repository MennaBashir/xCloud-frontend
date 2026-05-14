import { useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type RouteTransitionProps = {
	children: ReactNode;
};

/**
 * Content-aware entrance choreography on every route change.
 *
 * If the page marks key sections with `data-stagger` (a numeric ordering
 * hint, e.g. `data-stagger="0"`, `data-stagger="1"` …), those elements
 * animate in sequence — `y/opacity/blur` over ~380ms each with a 60ms
 * stagger, ease `power3.out`.
 *
 * If no `data-stagger` targets are found, the wrapper itself does a
 * single soft fade-up so untouched pages keep their entrance.
 *
 * Honors `prefers-reduced-motion` via `gsap.matchMedia()`.
 */
export function RouteTransition({ children }: RouteTransitionProps) {
	const location = useLocation();
	const wrapperRef = useRef<HTMLDivElement>(null);

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
					const root = wrapperRef.current;
					if (!root) return;

					const tagged = Array.from(
						root.querySelectorAll<HTMLElement>("[data-stagger]"),
					).sort((a, b) => {
						const ai = Number(a.dataset.stagger ?? "0");
						const bi = Number(b.dataset.stagger ?? "0");
						return ai - bi;
					});

					if (tagged.length > 0) {
						gsap.fromTo(
							tagged,
							{
								y: 14,
								autoAlpha: 0,
								filter: "blur(6px)",
							},
							{
								y: 0,
								autoAlpha: 1,
								filter: "blur(0px)",
								duration: 0.38,
								stagger: 0.06,
								ease: "power3.out",
								clearProps: "filter,transform",
							},
						);
					} else {
						// Fallback for pages without data-stagger markers.
						gsap.fromTo(
							root,
							{ y: 6, autoAlpha: 0.001 },
							{
								y: 0,
								autoAlpha: 1,
								duration: 0.28,
								ease: "power2.out",
								clearProps: "transform",
							},
						);
					}
				},
			);
			return () => mm.revert();
		},
		{ dependencies: [location.pathname] },
	);

	return (
		<div ref={wrapperRef} className="route-transition">
			{children}
		</div>
	);
}
