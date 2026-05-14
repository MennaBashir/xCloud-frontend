import { useTranslation } from "react-i18next";
import {
	Archive,
	FileText,
	Inbox,
	type LucideIcon,
	Send,
	Star,
	Tag,
	Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/shared/components/AnimatedNumber";
import { useGmailStore } from "../store/gmailStore";
import { LABELS } from "../mock/mockGmailService";
import { labelToneClass } from "./mail-meta";
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

type MobileFolderPillsProps = {
	counts: Record<Folder, number>;
	className?: string;
};

export function MobileFolderPills({
	counts,
	className,
}: MobileFolderPillsProps) {
	const { t } = useTranslation("gmail");
	const folder = useGmailStore((s) => s.folder);
	const setFolder = useGmailStore((s) => s.setFolder);
	const labelId = useGmailStore((s) => s.labelId);
	const setLabelId = useGmailStore((s) => s.setLabelId);
	const openCompose = useGmailStore((s) => s.openCompose);

	return (
		<nav
			aria-label={t("title")}
			className={cn(
				"md:hidden -mx-4 sm:-mx-6 mb-3",
				"overflow-x-auto scroll-smooth",
				"[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				className,
			)}
		>
			<div className="flex items-center gap-2 px-4 sm:px-6 py-1 min-w-max">
				{/* Compose pill */}
				<button
					type="button"
					onClick={() => openCompose()}
					className={cn(
						"inline-flex items-center gap-1.5 shrink-0",
						"h-8 ps-2.5 pe-3 rounded-full",
						"bg-primary text-primary-foreground",
						"text-[0.8125rem] font-medium",
						"shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
						"active:scale-[0.97]",
						"transition-transform duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
					)}
				>
					<span className="grid size-4 place-items-center rounded-full bg-background/15">
						<Send className="size-3 rtl-flip" strokeWidth={1.8} />
					</span>
					<span>{t("actions.compose")}</span>
				</button>

				<span
					aria-hidden="true"
					className="h-5 w-px bg-border shrink-0 mx-0.5"
				/>

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
							aria-pressed={active}
							className={cn(
								"inline-flex items-center gap-1.5 shrink-0",
								"h-8 px-3 rounded-full border",
								"text-[0.8125rem]",
								"transition-[background-color,color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
								active
									? "bg-foreground text-background border-foreground font-medium"
									: "bg-card text-muted-foreground border-border hover:text-foreground hover:border-border-strong",
							)}
						>
							<Icon
								className={cn(
									"size-3.5 shrink-0",
									f.key === "starred" &&
										active &&
										"text-warning fill-warning",
								)}
								strokeWidth={1.6}
							/>
							<span>{t(f.labelKey)}</span>
							{count > 0 ? (
								<AnimatedNumber
									value={count}
									className={cn(
										"font-mono text-[0.6875rem] tabular-nums ms-0.5",
										active ? "text-background/80" : "text-muted-foreground",
									)}
								/>
							) : null}
						</button>
					);
				})}

				{LABELS.length > 0 ? (
					<span
						aria-hidden="true"
						className="h-5 w-px bg-border shrink-0 mx-0.5"
					/>
				) : null}

				{LABELS.map((label) => {
					const active = labelId === label.id;
					return (
						<button
							key={label.id}
							type="button"
							onClick={() => setLabelId(active ? undefined : label.id)}
							aria-pressed={active}
							className={cn(
								"inline-flex items-center gap-1.5 shrink-0",
								"h-8 px-3 rounded-full border",
								"text-[0.8125rem]",
								"transition-[background-color,color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
								active
									? "bg-foreground text-background border-foreground font-medium"
									: "bg-card text-muted-foreground border-border hover:text-foreground hover:border-border-strong",
							)}
						>
							<span
								aria-hidden="true"
								className={cn(
									"grid size-4 place-items-center rounded-[var(--radius-xs)] ring-1 ring-inset shrink-0",
									labelToneClass(label.tone),
								)}
							>
								<Tag className="size-2.5" strokeWidth={2} />
							</span>
							<span className="truncate max-w-[140px]">{label.name}</span>
						</button>
					);
				})}
			</div>
		</nav>
	);
}
