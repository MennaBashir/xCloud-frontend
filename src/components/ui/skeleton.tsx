import { cn } from "@/lib/utils";

/**
 * Loading placeholder with a travelling brand-tinted shimmer. The shimmer
 * keyframe lives in `index.css` under the `.skeleton-shimmer` utility and
 * runs on a pseudo-element so the host stays semantically clean.
 *
 * Host must be `position: relative; overflow: hidden;` — handled here so
 * every existing consumer keeps working without changes.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn(
				"relative overflow-hidden rounded-md bg-surface-muted",
				"skeleton-shimmer",
				className,
			)}
			{...props}
		/>
	);
}

export { Skeleton };
