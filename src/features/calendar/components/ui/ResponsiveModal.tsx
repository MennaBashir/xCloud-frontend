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
						"absolute top-2 end-0 inline-grid place-items-center size-10",
						"rounded-[var(--radius-md)] border border-border bg-card",
						"text-foreground hover:bg-accent transition-colors duration-[var(--duration-fast)]",
						"shadow-[0_1px_2px_oklch(0_0_0/0.04)]",
					)}
				>
					<ListChecks className="size-4" strokeWidth={1.6} />
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
