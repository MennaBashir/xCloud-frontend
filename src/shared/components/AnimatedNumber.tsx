import { useEffect, useRef } from "react";
import gsap from "gsap";

import { cn } from "@/lib/utils";

type AnimatedNumberProps = {
	value: number;
	/** Animation duration in seconds (default 0.6). */
	duration?: number;
	/** Optional value formatter (e.g. for thousand separators). */
	format?: (value: number) => string;
	/** Optional className passed to the rendered span. */
	className?: string;
	/** Optional clamp/cap label, e.g. show "9+" when value > 9. */
	cap?: { at: number; label: string };
};

/**
 * Smoothly tweens a number to its new value using GSAP.
 * Renders an integer (or formatted string via `format`). Respects
 * `prefers-reduced-motion` by snapping to the final value.
 */
export function AnimatedNumber({
	value,
	duration = 0.6,
	format,
	className,
	cap,
}: AnimatedNumberProps) {
	const spanRef = useRef<HTMLSpanElement>(null);
	const lastValueRef = useRef<number>(value);

	useEffect(() => {
		const el = spanRef.current;
		if (!el) return;

		const from = lastValueRef.current;
		const to = value;
		lastValueRef.current = to;

		const render = (n: number) => {
			if (cap && n > cap.at) {
				el.textContent = cap.label;
				return;
			}
			const intVal = Math.round(n);
			el.textContent = format ? format(intVal) : String(intVal);
		};

		const reduce =
			typeof window !== "undefined" &&
			window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

		if (reduce || from === to) {
			render(to);
			return;
		}

		const obj = { v: from };
		const tween = gsap.to(obj, {
			v: to,
			duration,
			ease: "power2.out",
			onUpdate: () => render(obj.v),
			onComplete: () => render(to),
		});

		return () => {
			tween.kill();
		};
	}, [value, duration, format, cap]);

	// Initial render before the effect runs.
	const initial =
		cap && value > cap.at
			? cap.label
			: format
				? format(Math.round(value))
				: String(Math.round(value));

	return (
		<span
			ref={spanRef}
			className={cn("font-mono tabular-nums", className)}
		>
			{initial}
		</span>
	);
}
