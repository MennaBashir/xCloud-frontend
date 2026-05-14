import { useTranslation } from "react-i18next";
import { MoreHorizontal, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FileKindIcon } from "./FileKindIcon";
import { formatBytes, relativeTime } from "./file-meta";
import type { FileItem } from "../types/file";

type FileRowProps = {
	file: FileItem;
	onOpen: (file: FileItem) => void;
	onDelete: (file: FileItem) => void;
};

function initials(name: string) {
	return name
		.split(" ")
		.map((w) => w[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

export function FileRow({ file, onOpen, onDelete }: FileRowProps) {
	const { t } = useTranslation("files");
	const size = formatBytes(file.sizeBytes);
	const updated = relativeTime(file.updatedAt, (k, opts) =>
		t(k, opts as Record<string, unknown>),
	);

	return (
		<div
			role="row"
			data-list-item
			onClick={() => onOpen(file)}
			className={cn(
				"group/row grid grid-cols-[1fr_auto_auto_auto_auto] sm:grid-cols-[1fr_140px_120px_90px_40px] items-center gap-3 sm:gap-4",
				"px-3 sm:px-4 py-3 rounded-[var(--radius-md)]",
				"border border-transparent hover:border-border hover:bg-accent/40",
				"transition-[background-color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
				"cursor-pointer",
			)}
		>
			{/* Name + icon + tags */}
			<div className="flex items-center gap-3 min-w-0">
				<FileKindIcon kind={file.kind} size="md" />
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="truncate text-[0.9375rem] font-medium text-foreground">
							{file.name}
						</span>
						{file.fromMeeting ? (
							<Sparkles
								className="size-3 text-ai shrink-0"
								strokeWidth={1.8}
								aria-label={t("meta.fromMeeting", {
									title: file.meetingTitle ?? "",
								})}
							/>
						) : null}
					</div>
					<div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
						{file.tags.slice(0, 3).map((tag) => (
							<span
								key={tag}
								className="inline-flex items-center rounded-full bg-surface-muted text-muted-foreground px-1.5 py-0 text-[0.6875rem] font-medium"
							>
								{tag}
							</span>
						))}
					</div>
				</div>
			</div>

			{/* Owner */}
			<div className="hidden sm:flex items-center gap-2 min-w-0">
				<Avatar className="size-6 shrink-0">
					<AvatarImage src={file.owner.avatarUrl} alt="" />
					<AvatarFallback className="bg-surface-muted text-foreground text-[0.625rem] font-medium">
						{initials(file.owner.name)}
					</AvatarFallback>
				</Avatar>
				<span className="text-[0.8125rem] text-muted-foreground truncate">
					{file.owner.name}
				</span>
			</div>

			{/* Updated */}
			<span className="hidden sm:inline text-[0.8125rem] text-muted-foreground">
				{updated}
			</span>

			{/* Size */}
			<span className="hidden sm:inline font-mono text-[0.75rem] text-muted-foreground tabular-nums">
				{size.value} {size.unit}
			</span>

			{/* Mobile-only: meta condensed */}
			<div className="sm:hidden flex items-center gap-2 text-[0.75rem] text-muted-foreground">
				<span>{updated}</span>
				<span className="text-border">·</span>
				<span className="font-mono tabular-nums">
					{size.value} {size.unit}
				</span>
			</div>

			{/* Row menu */}
			<div
				onClick={(e) => e.stopPropagation()}
				className="flex justify-end"
			>
				<DropdownMenu>
					<DropdownMenuTrigger
						aria-label="Row actions"
						className={cn(
							"grid size-8 place-items-center rounded-[var(--radius-sm)]",
							"text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
						)}
					>
						<MoreHorizontal className="size-4" strokeWidth={1.6} />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onSelect={() => onOpen(file)}>
							{t("actions.openPreview")}
						</DropdownMenuItem>
						<DropdownMenuItem>{t("actions.download")}</DropdownMenuItem>
						<DropdownMenuItem>{t("actions.share")}</DropdownMenuItem>
						<DropdownMenuItem>{t("actions.copyLink")}</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive focus:text-destructive"
							onSelect={() => onDelete(file)}
						>
							{t("actions.delete")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
