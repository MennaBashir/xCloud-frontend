import { type ComponentType, type ReactNode, type SVGProps } from "react";
import { cn } from "@/lib/utils";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type EmptyStateProps = {
	/** Icon component (lucide-react). Rendered inside an icon disc. */
	icon?: IconComponent;
	title: ReactNode;
	description?: ReactNode;
	/** Action slot — usually a primary button. */
	action?: ReactNode;
	/** Optional secondary action / link. */
	secondaryAction?: ReactNode;
	tone?: "default" | "ai";
	className?: string;
};

/**
 * Empty state pattern used across the app.
 * Replaces ad-hoc "No files found" / "No events" screens.
 */
export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	secondaryAction,
	tone = "default",
	className,
}: EmptyStateProps) {
	const iconWrapClass =
		tone === "ai"
			? "bg-ai-tint text-ai ring-1 ring-inset ring-ai/20"
			: "bg-surface-muted text-muted-foreground ring-1 ring-inset ring-border";

	return (
		<div
			role="status"
			className={cn(
				"flex flex-col items-center justify-center gap-5",
				"py-16 px-6 text-center",
				"rounded-[var(--radius-2xl)] border border-dashed border-border",
				"bg-surface-muted/40",
				className,
			)}
		>
			{Icon ? (
				<div className={cn("grid size-14 place-items-center rounded-2xl", iconWrapClass)}>
					<Icon
						className="size-6"
						strokeWidth={1.5}
						aria-hidden="true"
					/>
				</div>
			) : null}

			<div className="flex max-w-md flex-col gap-1.5">
				<h3 className="text-[1.0625rem] font-semibold tracking-tight text-foreground">
					{title}
				</h3>
				{description ? (
					<p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
						{description}
					</p>
				) : null}
			</div>

			{(action || secondaryAction) ? (
				<div className="mt-1 flex flex-wrap items-center justify-center gap-2">
					{action}
					{secondaryAction}
				</div>
			) : null}
		</div>
	);
}
