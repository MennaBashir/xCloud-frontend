import { memo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────────
 * HeroMagneticCta — primary CTA with magnetic pull toward the cursor.
 *
 * Uses Framer Motion's `useMotionValue` + spring outside the React render
 * cycle, per the skill's section 4 anti-pattern rule (never useState for
 * continuous hover physics). On touch devices the pointermove never fires,
 * so the button stays static — no-op gracefully.
 * ──────────────────────────────────────────────────────────────────────── */

type HeroMagneticCtaProps = {
	label: string;
	href: string;
	className?: string;
};

export const HeroMagneticCta = memo(function HeroMagneticCta({
	label,
	href,
	className,
}: HeroMagneticCtaProps) {
	const ref = useRef<HTMLAnchorElement>(null);
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
	const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

	// Nested icon translates a bit further for internal kinetic tension
	const iconX = useTransform(springX, (v) => v * 1.6);
	const iconY = useTransform(springY, (v) => v * 1.6);

	const handlePointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
		const el = ref.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const dx = event.clientX - cx;
		const dy = event.clientY - cy;
		// Clamp the magnetic pull radius
		const maxPull = 10;
		x.set(Math.max(-maxPull, Math.min(maxPull, dx * 0.25)));
		y.set(Math.max(-maxPull, Math.min(maxPull, dy * 0.25)));
	};

	const handlePointerLeave = () => {
		x.set(0);
		y.set(0);
	};

	return (
		<motion.div
			style={{ x: springX, y: springY }}
			className={cn("inline-flex", className)}
		>
			<Link
				ref={ref}
				to={href}
				onPointerMove={handlePointerMove}
				onPointerLeave={handlePointerLeave}
				className={cn(
					"group/cta relative inline-flex items-center justify-center gap-2",
					"h-12 ps-6 pe-1.5 rounded-full",
					"bg-foreground text-background",
					"font-medium tracking-tight text-[0.9375rem]",
					"shadow-[0_1px_2px_oklch(0_0_0/0.10),0_8px_20px_-12px_oklch(0_0_0/0.30),inset_0_1px_0_oklch(1_0_0/0.10)]",
					"transition-[transform,background-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
					"hover:bg-foreground/92",
					"active:scale-[0.98] active:transition-transform active:duration-75",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
					"w-full xs:w-auto",
				)}
			>
				<span>{label}</span>
				{/* Button-in-button trailing icon — Double-Bezel CTA per skill 4.B */}
				<motion.span
					style={{ x: iconX, y: iconY }}
					className={cn(
						"relative grid place-items-center size-9 rounded-full shrink-0",
						"bg-background/12 text-background",
						"transition-[transform,background-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
						"group-hover/cta:bg-background/18",
					)}
				>
					<ArrowRight
						className="size-4 rtl-flip transition-transform duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/cta:translate-x-0.5"
						strokeWidth={1.8}
					/>
				</motion.span>
			</Link>
		</motion.div>
	);
});
