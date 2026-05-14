import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
	/** Optional small label that sits above the title. */
	eyebrow?: ReactNode;
	/** Required main heading. */
	title: ReactNode;
	/** Optional supporting copy below the title. */
	description?: ReactNode;
	/** Right-aligned actions (buttons, filters, etc.). */
	actions?: ReactNode;
	/** Render as a heavier hero-style header. */
	size?: "default" | "lg";
	className?: string;
	/** Optional content that renders flush below the title block. */
	children?: ReactNode;
};

/**
 * Per-page header used at the top of every app page.
 *
 *   <PageHeader
 *     eyebrow="Workspace"
 *     title="Files"
 *     description="All your team documents in one place."
 *     actions={<Button>Upload</Button>}
 *   />
 */
export function PageHeader({
	eyebrow,
	title,
	description,
	actions,
	size = "default",
	className,
	children,
}: PageHeaderProps) {
	return (
		<header
			data-stagger="0"
			className={cn(
				"flex flex-col gap-6 pb-6",
				size === "default" && "pt-6 md:pt-8",
				size === "lg" && "pt-10 md:pt-14",
				className,
			)}
		>
			<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
				<div className="flex flex-col gap-2 min-w-0">
					{eyebrow ? (
						<span
							className={cn(
								"text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground",
							)}
						>
							{eyebrow}
						</span>
					) : null}

					<h1
						className={cn(
							"font-semibold tracking-tight text-foreground leading-[1.05]",
							size === "default" && "text-[1.75rem] md:text-[2rem]",
							size === "lg" &&
								"text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem]",
						)}
					>
						{title}
					</h1>

					{description ? (
						<p
							className={cn(
								"max-w-[60ch] text-muted-foreground leading-relaxed",
								size === "default" && "text-[0.9375rem]",
								size === "lg" && "text-[1.0625rem] md:text-[1.125rem]",
							)}
						>
							{description}
						</p>
					) : null}
				</div>

				{actions ? (
					<div className="flex shrink-0 items-center gap-2">{actions}</div>
				) : null}
			</div>

			{children}
		</header>
	);
}
