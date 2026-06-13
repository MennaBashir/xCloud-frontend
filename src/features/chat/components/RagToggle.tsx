import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";

import { cn } from "@/lib/utils";

type RagToggleProps = {
	active: boolean;
	onToggle: (next: boolean) => void;
};

export function RagToggle({ active, onToggle }: RagToggleProps) {
	const { t } = useTranslation("chat");

	return (
		<button
			type="button"
			onClick={() => onToggle(!active)}
			aria-pressed={active}
			aria-label={t("rag.toggle")}
			title={t("rag.tooltip")}
			className={cn(
				"inline-flex items-center gap-1.5",
				"h-8 px-2.5 rounded-full text-[0.75rem] font-medium",
				"transition-colors duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
				active
					? "bg-ai-tint text-ai ring-1 ring-inset ring-ai/25"
					: "text-muted-foreground hover:bg-accent hover:text-foreground",
			)}
		>
			<FileText className="size-3.5" strokeWidth={1.7} />
			<span>{t("rag.label")}</span>
		</button>
	);
}
