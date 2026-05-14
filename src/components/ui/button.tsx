import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	[
		// layout + base
		"inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0",
		"font-medium tracking-tight select-none",
		// icon sizing
		"[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
		// states
		"disabled:pointer-events-none disabled:opacity-50",
		// transitions — custom cubic-bezier, no `transition-all` slop
		"transition-[transform,background-color,color,border-color,box-shadow,opacity] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
		// tactile press
		"active:scale-[0.98] active:transition-transform active:duration-75",
		// focus
		"outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		// invalid
		"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	].join(" "),
	{
		variants: {
			variant: {
				default: [
					"bg-primary text-primary-foreground",
					"shadow-[0_1px_2px_oklch(0_0_0/0.06),inset_0_1px_0_oklch(1_0_0/0.12)]",
					"hover:bg-primary/92 hover:shadow-[0_2px_8px_oklch(0_0_0/0.08),inset_0_1px_0_oklch(1_0_0/0.16)]",
				].join(" "),
				secondary: [
					"bg-secondary text-secondary-foreground",
					"ring-1 ring-inset ring-border",
					"hover:bg-accent",
				].join(" "),
				outline: [
					"bg-transparent text-foreground",
					"ring-1 ring-inset ring-border",
					"hover:bg-accent hover:ring-border-strong",
					"dark:bg-surface-muted/40",
				].join(" "),
				ghost: [
					"bg-transparent text-foreground",
					"hover:bg-accent",
				].join(" "),
				destructive: [
					"bg-destructive text-destructive-foreground",
					"shadow-[0_1px_2px_oklch(0_0_0/0.08)]",
					"hover:bg-destructive/92",
					"focus-visible:ring-destructive/60",
				].join(" "),
				link: [
					"text-foreground underline-offset-4 hover:underline",
					"h-auto px-0 py-0 active:scale-100",
				].join(" "),
				// AI surface — subtle electric blue, not glowy
				ai: [
					"bg-ai-tint text-ai dark:text-ai-foreground",
					"ring-1 ring-inset ring-ai/20 dark:ring-ai/30",
					"hover:bg-ai/12 hover:ring-ai/30",
				].join(" "),
				// Brand gradient — reserve for hero CTAs only
				brand: [
					"text-white",
					"bg-[linear-gradient(135deg,var(--brand-from)_0%,var(--brand-to)_100%)]",
					"shadow-[0_1px_2px_oklch(0_0_0/0.1),inset_0_1px_0_oklch(1_0_0/0.18)]",
					"hover:shadow-[0_4px_16px_oklch(0.62_0.19_245/0.32),inset_0_1px_0_oklch(1_0_0/0.22)]",
				].join(" "),
			},
			size: {
				default: "h-9 px-4 text-[0.875rem] rounded-[var(--radius-md)]",
				sm: "h-8 px-3 text-[0.8125rem] rounded-[var(--radius-sm)] gap-1.5",
				lg: "h-11 px-6 text-[0.9375rem] rounded-[var(--radius-lg)]",
				xl: "h-13 px-7 text-[0.9375rem] rounded-[var(--radius-xl)]",
				// pills (rounded-full) for landing/hero CTAs
				pill: "h-11 pl-6 pr-2 text-[0.9375rem] rounded-full gap-2",
				"pill-sm": "h-9 pl-5 pr-1.5 text-[0.875rem] rounded-full gap-1.5",
				// icon-only
				icon: "size-9 rounded-[var(--radius-md)]",
				"icon-sm": "size-8 rounded-[var(--radius-sm)]",
				"icon-lg": "size-11 rounded-[var(--radius-lg)]",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

type ButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	};

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

/**
 * The "button-in-button" trailing icon pattern.
 * Place inside a `pill` or `pill-sm` Button to get the nested icon disc.
 *
 *   <Button size="pill">
 *     Get started <ButtonTrailingIcon><ArrowUpRight /></ButtonTrailingIcon>
 *   </Button>
 */
function ButtonTrailingIcon({
	className,
	children,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="button-trailing-icon"
			className={cn(
				"grid size-8 place-items-center rounded-full shrink-0",
				"bg-oklch-overlay transition-transform duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
				"group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px",
				// subtle inner ring
				"ring-1 ring-inset ring-white/10",
				className,
			)}
			style={{
				background:
					"color-mix(in oklch, currentColor 14%, transparent)",
			}}
			{...props}
		>
			<span className="grid size-3.5 place-items-center [&_svg]:size-3.5">
				{children}
			</span>
		</span>
	);
}

export { Button, ButtonTrailingIcon, buttonVariants };
