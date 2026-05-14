import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionCardProps = {
	children: ReactNode;
	className?: string;
	/** Inner padding applied to the core surface. */
	contentClassName?: string;
	/** Outer shell padding (the "tray" that holds the core). */
	bezelPadding?: "sm" | "md" | "lg";
	/** Render without the outer bezel — flat card variant. */
	flat?: boolean;
	as?: "section" | "div" | "article";
};

/**
 * Premium nested container per the "Double-Bezel" pattern.
 *
 * Renders an outer shell with a hairline border that holds an inner core
 * with its own background + concentric radius. Optionally render flat.
 *
 *   <SectionCard>
 *     <h2>Live agenda</h2>
 *     ...
 *   </SectionCard>
 */
export function SectionCard({
	children,
	className,
	contentClassName,
	bezelPadding = "md",
	flat = false,
	as: Component = "section",
}: SectionCardProps) {
	if (flat) {
		return (
			<Component
				data-slot="section-card"
				data-variant="flat"
				className={cn(
					"rounded-[var(--radius-2xl)] border border-border bg-card",
					"shadow-[0_1px_2px_oklch(0_0_0/0.03),inset_0_1px_0_oklch(1_0_0/0.05)]",
					contentClassName,
					className,
				)}
			>
				{children}
			</Component>
		);
	}

	const padMap = {
		sm: "p-1",
		md: "p-1.5",
		lg: "p-2",
	} as const;

	const innerRadiusMap = {
		sm: "rounded-[calc(var(--radius-3xl)-0.25rem)]",
		md: "rounded-[calc(var(--radius-3xl)-0.375rem)]",
		lg: "rounded-[calc(var(--radius-3xl)-0.5rem)]",
	} as const;

	return (
		<Component
			data-slot="section-card"
			data-variant="bezel"
			className={cn(
				"rounded-[var(--radius-3xl)] bg-surface-muted/60",
				"ring-1 ring-inset ring-border",
				"dark:bg-surface-muted/30",
				padMap[bezelPadding],
				className,
			)}
		>
			<div
				className={cn(
					"bg-card border border-border",
					"shadow-[0_1px_2px_oklch(0_0_0/0.04),inset_0_1px_0_oklch(1_0_0/0.06)]",
					innerRadiusMap[bezelPadding],
					contentClassName,
				)}
			>
				{children}
			</div>
		</Component>
	);
}
