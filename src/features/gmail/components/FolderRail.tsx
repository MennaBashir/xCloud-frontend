import { useTranslation } from "react-i18next";
import {
	Archive,
	FileText,
	Inbox,
	type LucideIcon,
	Send,
	Star,
	Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/shared/components/AnimatedNumber";
import { useGmailStore } from "../store/gmailStore";
import type { Folder } from "../types/mail";

type FolderEntry = {
	key: Folder;
	icon: LucideIcon;
	labelKey: string;
};

const FOLDERS: FolderEntry[] = [
	{ key: "inbox", icon: Inbox, labelKey: "folders.inbox" },
	{ key: "starred", icon: Star, labelKey: "folders.starred" },
	{ key: "sent", icon: Send, labelKey: "folders.sent" },
	{ key: "drafts", icon: FileText, labelKey: "folders.drafts" },
	{ key: "archive", icon: Archive, labelKey: "folders.archive" },
	{ key: "trash", icon: Trash2, labelKey: "folders.trash" },
];

type FolderRailProps = {
	counts: Record<Folder, number>;
};

export function FolderRail({ counts }: FolderRailProps) {
	const { t } = useTranslation("gmail");
	const folder = useGmailStore((s) => s.folder);
	const setFolder = useGmailStore((s) => s.setFolder);
	const labelId = useGmailStore((s) => s.labelId);
	const setLabelId = useGmailStore((s) => s.setLabelId);
	const openCompose = useGmailStore((s) => s.openCompose);

	return (
		<aside
			className={cn(
				"hidden md:flex flex-col shrink-0 w-[220px]",
				"h-[calc(100dvh-12rem)] max-h-[780px]",
				"rounded-[var(--radius-2xl)] border border-border bg-card overflow-hidden",
			)}
		>
			{/* Compose — pinned top */}
			<div className="flex-none p-3 border-b border-border">
				<Button
					onClick={() => openCompose()}
					className="gap-2 justify-start w-full"
				>
					<span className="grid size-4 place-items-center rounded-full bg-background/15 text-current">
						<Send className="size-3 rtl-flip" strokeWidth={1.8} />
					</span>
					<span>{t("actions.compose")}</span>
				</Button>
			</div>

			{/* Folders + labels — scrolls internally */}
			<div className="flex-1 min-h-0 overflow-y-auto p-2">
				<nav
					aria-label={t("title")}
					className="flex flex-col gap-0.5"
				>
					{FOLDERS.map((f) => {
						const Icon = f.icon;
						const active = folder === f.key && !labelId;
						const count = counts[f.key];
						return (
							<button
								key={f.key}
								type="button"
								onClick={() => {
									setLabelId(undefined);
									setFolder(f.key);
								}}
								className={cn(
									"inline-flex items-center gap-2.5",
									"h-9 px-3 rounded-[var(--radius-md)]",
									"text-[0.875rem]",
									"transition-[background-color,color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
									active
										? "bg-accent text-foreground font-medium"
										: "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
								)}
							>
								<Icon
									className={cn(
										"size-4 shrink-0",
										f.key === "starred" &&
											active &&
											"text-warning fill-warning",
									)}
									strokeWidth={1.6}
								/>
								<span className="flex-1 text-start truncate">
									{t(f.labelKey)}
								</span>
								{count > 0 ? (
									<AnimatedNumber
										value={count}
										className={cn(
											"font-mono text-[0.6875rem] tabular-nums",
											active
												? "text-foreground"
												: "text-muted-foreground",
										)}
									/>
								) : null}
							</button>
						);
					})}
				</nav>
			</div>
		</aside>
	);
}
