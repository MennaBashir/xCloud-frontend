import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type EyebrowTagProps = {
	children: ReactNode;
	className?: string;
	/** Optional small leading dot for "live"-feeling indicators. */
	withDot?: boolean;
	tone?: "default" | "ai" | "success";
};

/**
 * Tiny pill-shaped label placed above marketing headlines.
 * Per the high-end design system: uppercase, tracked,
 * hairline border — never a solid colored badge.
 */
export function EyebrowTag({
	children,
	className,
	withDot = false,
	tone = "default",
}: EyebrowTagProps) {
	const toneClass =
		tone === "ai"
			? "border-ai/25 bg-ai-tint text-ai"
			: tone === "success"
				? "border-success/30 bg-[color-mix(in_oklch,var(--success)_10%,transparent)] text-success"
				: "border-border bg-surface-muted text-muted-foreground";

	const dotToneClass =
		tone === "ai"
			? "bg-ai"
			: tone === "success"
				? "bg-success"
				: "bg-muted-foreground";

	return (
		<span
			className={cn(
				"inline-flex items-center gap-2 rounded-full border px-2.5 py-1",
				"text-[0.6875rem] font-medium uppercase tracking-[0.18em]",
				toneClass,
				className,
			)}
		>
			{withDot ? (
				<span className="relative grid size-1.5 place-items-center">
					<span
						className={cn(
							"absolute inset-0 rounded-full opacity-60 animate-ping",
							dotToneClass,
						)}
					/>
					<span className={cn("relative size-1.5 rounded-full", dotToneClass)} />
				</span>
			) : null}
			{children}
		</span>
	);
}
