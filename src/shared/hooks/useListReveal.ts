import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Options = {
	/** CSS selector for items inside the scope. Defaults to `[data-list-item]`. */
	selector?: string;
	/** Re-run the reveal whenever any of these change (e.g. filter/sort/folder). */
	deps?: unknown[];
};

/**
 * Choreographs the entry of a list/grid: items fade + lift + faintly scale
 * up as they enter the viewport (or on mount if already visible).
 *
 * Uses `ScrollTrigger.batch` so we never spawn one trigger per item — the
 * GSAP-recommended pattern for list/grid reveals. Plays once per element
 * (`once: true`).
 *
 * Honors `prefers-reduced-motion` via `gsap.matchMedia()`.
 *
 * Usage:
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   useListReveal(containerRef, { deps: [items.length, filter] });
 *   return <div ref={containerRef}>{items.map(i => <Row data-list-item ... />)}</div>;
 */
export function useListReveal(
	scope: RefObject<HTMLElement | null>,
	options: Options = {},
): void {
	const { selector = "[data-list-item]", deps = [] } = options;
	const lastRunRef = useRef<number>(0);

	useGSAP(
		() => {
			const root = scope.current;
			if (!root) return;

			const mm = gsap.matchMedia();
			mm.add(
				{
					default: "(prefers-reduced-motion: no-preference)",
					reduced: "(prefers-reduced-motion: reduce)",
				},
				(ctx) => {
					if (ctx.conditions?.reduced) return;

					const items = Array.from(
						root.querySelectorAll<HTMLElement>(selector),
					);
					if (items.length === 0) return;

					// Set initial state for every item; ScrollTrigger.batch
					// reveals them as they enter the viewport.
					gsap.set(items, {
						y: 14,
						autoAlpha: 0,
						scale: 0.985,
						transformOrigin: "center top",
					});

					const triggers = ScrollTrigger.batch(items, {
						start: "top 92%",
						once: true,
						interval: 0.05,
						batchMax: 12,
						onEnter: (batch) => {
							gsap.to(batch, {
								y: 0,
								autoAlpha: 1,
								scale: 1,
								duration: 0.42,
								ease: "power3.out",
								stagger: 0.04,
								overwrite: true,
								clearProps: "transform,opacity,visibility",
							});
						},
					});

					lastRunRef.current = Date.now();

					return () => {
						triggers.forEach((t) => t.kill());
					};
				},
			);

			return () => mm.revert();
		},
		{ scope, dependencies: deps },
	);
}
