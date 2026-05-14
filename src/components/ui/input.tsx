import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				// layout
				"flex h-10 w-full min-w-0 px-3.5 py-2",
				"rounded-[var(--radius-md)] bg-surface-elevated",
				// typography
				"text-[0.9375rem] text-foreground placeholder:text-muted-foreground/70",
				"selection:bg-ring/20 selection:text-foreground",
				// borders + ring (hairline default, ring on focus — no chunky 3px ring)
				"border border-border",
				"shadow-[0_1px_2px_oklch(0_0_0/0.02),inset_0_1px_0_oklch(1_0_0/0.04)]",
				// transitions
				"transition-[color,border-color,box-shadow,background-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
				// outline reset
				"outline-none",
				// focus — refined 2px ring, no offset glow
				"focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
				// hover
				"hover:border-border-strong",
				// file inputs
				"file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
				// disabled
				"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
				// invalid
				"aria-invalid:border-destructive aria-invalid:ring-destructive/20",
				// dark mode subtle surface
				"dark:bg-surface-muted/60",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
