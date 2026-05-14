import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Card variants follow the high-end aesthetic:
 *   - `default`: hairline border, surface-elevated, soft inner highlight
 *   - `bezel`:   outer shell wrapping an inner core (use with <CardCore>)
 *   - `glass`:   refraction-grade glass surface for floating panels
 *   - `subtle`:  no border, surface-muted bg — for grouped content
 */
const cardVariants = cva(
	[
		"flex flex-col text-card-foreground",
		"transition-[transform,box-shadow,border-color] duration-[var(--duration-base)] ease-[cubic-bezier(0.32,0.72,0,1)]",
	].join(" "),
	{
		variants: {
			variant: {
				default: [
					"bg-card",
					"border border-border",
					"rounded-[var(--radius-xl)]",
					"shadow-[0_1px_2px_oklch(0_0_0/0.03),inset_0_1px_0_oklch(1_0_0/0.05)]",
				].join(" "),
				bezel: [
					// outer shell — distinct subtle bg + hairline outer ring
					"bg-surface-muted/60 dark:bg-surface-muted/40",
					"ring-1 ring-inset ring-border",
					"rounded-[var(--radius-3xl)] p-1.5",
				].join(" "),
				glass: [
					"surface-glass rounded-[var(--radius-2xl)]",
				].join(" "),
				subtle: [
					"bg-surface-muted",
					"rounded-[var(--radius-lg)]",
				].join(" "),
			},
			interactive: {
				true: "hover:border-border-strong hover:shadow-diffusion cursor-pointer",
				false: "",
			},
		},
		defaultVariants: {
			variant: "default",
			interactive: false,
		},
	},
);

type CardProps = React.ComponentProps<"div"> & VariantProps<typeof cardVariants>;

function Card({ className, variant, interactive, ...props }: CardProps) {
	return (
		<div
			data-slot="card"
			data-variant={variant ?? "default"}
			className={cn(cardVariants({ variant, interactive }), className)}
			{...props}
		/>
	);
}

/**
 * Inner core used inside a `bezel` variant Card.
 * Calculates its own radius from the outer to keep concentric curves.
 */
function CardCore({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-core"
			className={cn(
				"flex flex-col bg-card",
				"rounded-[calc(var(--radius-3xl)-0.375rem)]",
				"border border-border",
				"shadow-[0_1px_2px_oklch(0_0_0/0.04),inset_0_1px_0_oklch(1_0_0/0.06)]",
				className,
			)}
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"flex flex-col gap-1.5 px-6 pt-6",
				"has-data-[slot=card-action]:grid has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-action]:items-start",
				className,
			)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn(
				"text-[1.0625rem] font-semibold leading-tight tracking-tight text-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn(
				"text-[0.875rem] leading-relaxed text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-action"
			className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-content"
			className={cn("px-6 py-6 first:pt-6 last:pb-6 [&:not(:first-child)]:pt-4", className)}
			{...props}
		/>
	);
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn(
				"flex items-center px-6 pb-6 pt-4",
				"[.border-t]:pt-6 [.border-t]:border-t [.border-t]:border-border",
				className,
			)}
			{...props}
		/>
	);
}

export {
	Card,
	CardCore,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
	cardVariants,
};
