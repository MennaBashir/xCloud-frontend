import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	[
		"inline-flex items-center justify-center gap-1 shrink-0 w-fit whitespace-nowrap",
		"font-medium",
		"[&>svg]:size-3 [&>svg]:pointer-events-none [&>svg]:shrink-0",
		"transition-[color,background-color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
		"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		"aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
		"overflow-hidden",
	].join(" "),
	{
		variants: {
			variant: {
				default: [
					"border border-transparent bg-primary text-primary-foreground",
					"[a&]:hover:bg-primary/90",
				].join(" "),
				secondary: [
					"border border-transparent bg-secondary text-secondary-foreground",
					"[a&]:hover:bg-accent",
				].join(" "),
				outline: [
					"border border-border bg-transparent text-foreground",
					"[a&]:hover:bg-accent",
				].join(" "),
				success: [
					"border border-transparent text-success",
					"bg-[color-mix(in_oklch,var(--success)_14%,transparent)]",
				].join(" "),
				warning: [
					"border border-transparent text-warning",
					"bg-[color-mix(in_oklch,var(--warning)_18%,transparent)]",
				].join(" "),
				destructive: [
					"border border-transparent bg-destructive text-destructive-foreground",
					"[a&]:hover:bg-destructive/90",
				].join(" "),
				// AI surface — subtle electric blue tint
				ai: [
					"border border-ai/20 text-ai",
					"bg-ai-tint",
				].join(" "),
				// Eyebrow tag — uppercase, tracked, pre-headline
				eyebrow: [
					"border border-border bg-surface-muted text-muted-foreground",
					"uppercase tracking-[0.18em] font-medium",
				].join(" "),
			},
			size: {
				default: "h-5 rounded-full px-2 text-[0.6875rem]",
				sm: "h-4 rounded-full px-1.5 text-[0.6875rem]",
				md: "h-6 rounded-full px-2.5 text-[0.75rem]",
				lg: "h-7 rounded-full px-3 text-[0.8125rem]",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Badge({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-slot="badge"
			data-variant={variant ?? "default"}
			className={cn(badgeVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
