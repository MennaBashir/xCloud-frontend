import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type ScrollToBottomButtonProps = {
	visible: boolean;
	onClick: () => void;
	className?: string;
};

/**
 * Floating "Scroll to latest" pill — appears ~20px above the chat input
 * when the user has scrolled up away from the bottom of the message list.
 */
export function ScrollToBottomButton({
	visible,
	onClick,
	className,
}: ScrollToBottomButtonProps) {
	const { t } = useTranslation("chat");

	return (
		<button
			type="button"
			onClick={onClick}
			aria-hidden={!visible}
			tabIndex={visible ? 0 : -1}
			aria-label={t("scroll.latest")}
			className={cn(
				"absolute left-1/2 -translate-x-1/2 bottom-3",
				"inline-flex items-center gap-1.5",
				"h-9 px-3.5 rounded-full",
				"border border-border bg-card text-foreground",
				"text-[0.75rem] font-medium",
				"shadow-[0_1px_2px_oklch(0_0_0/0.04),0_12px_24px_-12px_oklch(0_0_0/0.18)]",
				"transition-[opacity,transform] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
				"hover:bg-accent active:scale-[0.96]",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
				visible
					? "opacity-100 translate-y-0 pointer-events-auto"
					: "opacity-0 translate-y-1 pointer-events-none",
				className,
			)}
		>
			<ChevronDown className="size-3.5" strokeWidth={1.8} />
			<span>{t("scroll.latest")}</span>
		</button>
	);
}
