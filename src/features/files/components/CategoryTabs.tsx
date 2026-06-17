import { useTranslation } from "react-i18next";
import { Folder, Mic, Sparkles, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFilesStore } from "../store/filesStore";
import type { FileCategory } from "../types/file";

type TabDef = {
	key: FileCategory;
	icon: LucideIcon;
	labelKey: string;
};

const TABS: TabDef[] = [
	{ key: "all", icon: Folder, labelKey: "categories.all" },
	{ key: "summarized", icon: Sparkles, labelKey: "categories.summarized" },
	{ key: "recordings", icon: Mic, labelKey: "categories.recordings" },
];

export function CategoryTabs() {
	const { t } = useTranslation("files");
	const category = useFilesStore((s) => s.category);
	const setCategory = useFilesStore((s) => s.setCategory);

	return (
		<div
			role="tablist"
			aria-label={t("title")}
			className="flex items-center gap-1 overflow-x-auto -mx-2 px-2 pb-1"
		>
			{TABS.map((tab) => {
				const active = category === tab.key;
				const Icon = tab.icon;
				return (
					<button
						key={tab.key}
						type="button"
						role="tab"
						aria-selected={active}
						onClick={() => setCategory(tab.key)}
						className={cn(
							"group/tab inline-flex items-center gap-2 shrink-0",
							"h-9 px-3.5 rounded-full",
							"text-[0.875rem] font-medium",
							"transition-[background-color,color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
							active
								? "bg-foreground text-background"
								: "text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent hover:border-border",
						)}
					>
						<Icon className="size-3.5" strokeWidth={1.6} />
						<span>{t(tab.labelKey)}</span>
					</button>
				);
			})}
		</div>
	);
}
