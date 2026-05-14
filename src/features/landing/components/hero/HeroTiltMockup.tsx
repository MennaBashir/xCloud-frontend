import { memo, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────────
 * HeroTiltMockup — wraps the hero mockup in a Double-Bezel (outer shell +
 * inner core) and applies a subtle mouse-tracked parallax tilt on lg+ only.
 *
 * - Motion values driven outside the React render cycle (per skill 4 anti-
 *   pattern rule on useState for continuous hover).
 * - Tilt clamped to ±4deg, disabled on touch / small screens via media query
 *   (pointermove on touch is rare and the transform stays at 0).
 * ──────────────────────────────────────────────────────────────────────── */

export const HeroTiltMockup = memo(function HeroTiltMockup({
	children,
}: {
	children: ReactNode;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const mx = useMotionValue(0); // -0.5 .. 0.5 along width
	const my = useMotionValue(0); // -0.5 .. 0.5 along height

	const springX = useSpring(mx, { stiffness: 140, damping: 20, mass: 0.5 });
	const springY = useSpring(my, { stiffness: 140, damping: 20, mass: 0.5 });

	// Rotate around X (vertical axis) inversely to mouseY, around Y to mouseX
	const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4]);
	const rotateY = useTransform(springX, [-0.5, 0.5], [-4, 4]);

	const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		// Skip on touch / coarse pointers
		if (event.pointerType !== "mouse") return;
		const el = ref.current;
		if (!el) return;
		// Disable below lg breakpoint (1024px) — heavy interaction is desktop only
		if (window.innerWidth < 1024) return;
		const rect = el.getBoundingClientRect();
		const nx = (event.clientX - rect.left) / rect.width - 0.5;
		const ny = (event.clientY - rect.top) / rect.height - 0.5;
		mx.set(nx);
		my.set(ny);
	};

	const handlePointerLeave = () => {
		mx.set(0);
		my.set(0);
	};

	return (
		<motion.div
			ref={ref}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
			style={{
				rotateX,
				rotateY,
				transformPerspective: 1200,
				transformStyle: "preserve-3d",
			}}
			className={cn(
				// Outer shell — Double-Bezel
				"relative rounded-[2rem] p-1.5 sm:p-2",
				"bg-foreground/[0.035] ring-1 ring-inset ring-border",
				"shadow-[0_1px_2px_oklch(0_0_0/0.04),0_40px_80px_-30px_oklch(0_0_0/0.22)]",
				"will-change-transform",
			)}
		>
			{/* Glow under the mockup */}
			<div
				aria-hidden="true"
				className="absolute -inset-x-16 -bottom-16 -z-10 h-32 opacity-55 blur-3xl"
				style={{
					background:
						"radial-gradient(ellipse at center, oklch(0.62 0.19 245 / 0.32), transparent 70%)",
				}}
			/>
			{children}
		</motion.div>
	);
});
