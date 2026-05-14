import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"flex field-sizing-content min-h-20 w-full px-3.5 py-2.5",
				"rounded-[var(--radius-md)] bg-surface-elevated",
				"text-[0.9375rem] text-foreground placeholder:text-muted-foreground/70",
				"selection:bg-ring/20 selection:text-foreground",
				"border border-border",
				"shadow-[0_1px_2px_oklch(0_0_0/0.02),inset_0_1px_0_oklch(1_0_0/0.04)]",
				"transition-[color,border-color,box-shadow,background-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
				"outline-none resize-y",
				"focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
				"hover:border-border-strong",
				"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
				"aria-invalid:border-destructive aria-invalid:ring-destructive/20",
				"dark:bg-surface-muted/60",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
