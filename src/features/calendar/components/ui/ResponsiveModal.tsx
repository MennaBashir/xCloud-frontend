import * as React from "react";
import { ListChecks } from "lucide-react";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/hooks/use-media-query";
import { useLanguage } from "@/shared/i18n/LanguageProvider";

interface ResponsiveModalProps {
	children: React.ReactNode;
}

export default function ResponsiveModal({ children }: ResponsiveModalProps) {
	const isDesktop = useMediaQuery("(min-width: 1200px)");
	const { isRtl } = useLanguage();

	if (isDesktop) {
		return <>{children}</>;
	}

	return (
		<Sheet>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Events list"
					className={cn(
						"fixed z-30 inline-grid place-items-center size-12",
						"rounded-full border border-border bg-card",
						"text-foreground hover:bg-accent transition-colors duration-[var(--duration-fast)]",
						"shadow-[0_4px_16px_oklch(0_0_0/0.18),0_1px_2px_oklch(0_0_0/0.08)]",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
						"active:scale-[0.97]",
					)}
					style={{
						bottom: "max(1rem, env(safe-area-inset-bottom))",
						insetInlineEnd: "1rem",
					}}
				>
					<ListChecks className="size-5" strokeWidth={1.6} />
				</button>
			</SheetTrigger>
			<SheetContent
				side={isRtl ? "left" : "right"}
				className="w-fit max-w-[90vw] bg-transparent border-none p-4"
			>
				<div className="sr-only">
					<SheetHeader>
						<SheetTitle>Events</SheetTitle>
						<SheetDescription>Events list</SheetDescription>
					</SheetHeader>
				</div>
				{children}
			</SheetContent>
		</Sheet>
	);
}
