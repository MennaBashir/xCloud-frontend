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

type FileCardProps = {
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

export function FileCard({ file, onOpen, onDelete }: FileCardProps) {
	const { t } = useTranslation("files");
	const size = formatBytes(file.sizeBytes);
	const updated = relativeTime(file.updatedAt, (k, opts) =>
		t(k, opts as Record<string, unknown>),
	);

	return (
		<div
			onClick={() => onOpen(file)}
			role="button"
			data-list-item
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onOpen(file);
				}
			}}
			className={cn(
				"group/card relative flex flex-col gap-3",
				"rounded-[var(--radius-xl)] border border-border bg-card",
				"p-4 cursor-pointer",
				"transition-[transform,border-color,box-shadow] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
				"hover:border-border-strong hover:-translate-y-0.5 hover:shadow-[0_1px_2px_oklch(0_0_0/0.03),0_16px_32px_-18px_oklch(0_0_0/0.12)]",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			)}
		>
			{/* Top row: icon + actions */}
			<div className="flex items-start justify-between gap-3">
				<FileKindIcon kind={file.kind} size="lg" />
				<div onClick={(e) => e.stopPropagation()}>
					<DropdownMenu>
						<DropdownMenuTrigger
							aria-label="Card actions"
							className={cn(
								"grid size-8 place-items-center rounded-[var(--radius-sm)]",
								"text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
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

			{/* Name + meeting badge */}
			<div className="flex flex-col gap-1 min-w-0">
				<h3 className="truncate text-[0.9375rem] font-medium text-foreground leading-tight">
					{file.name}
				</h3>
				{file.fromMeeting && file.meetingTitle ? (
					<span className="inline-flex items-center gap-1.5 text-[0.6875rem] text-ai">
						<Sparkles className="size-3" strokeWidth={1.8} />
						<span className="truncate">{file.meetingTitle}</span>
					</span>
				) : null}
			</div>

			{/* Tags */}
			{file.tags.length > 0 ? (
				<div className="flex items-center gap-1.5 flex-wrap">
					{file.tags.slice(0, 3).map((tag) => (
						<span
							key={tag}
							className="inline-flex items-center rounded-full bg-surface-muted text-muted-foreground px-2 py-0.5 text-[0.6875rem] font-medium"
						>
							{tag}
						</span>
					))}
				</div>
			) : null}

			{/* Footer meta */}
			<div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-2">
				<div className="flex items-center gap-2 min-w-0">
					<Avatar className="size-5 shrink-0">
						<AvatarImage src={file.owner.avatarUrl} alt="" />
						<AvatarFallback className="bg-surface-muted text-foreground text-[0.625rem] font-medium">
							{initials(file.owner.name)}
						</AvatarFallback>
					</Avatar>
					<span className="text-[0.75rem] text-muted-foreground truncate">
						{updated}
					</span>
				</div>
				<span className="font-mono text-[0.6875rem] text-muted-foreground tabular-nums shrink-0">
					{size.value} {size.unit}
				</span>
			</div>
		</div>
	);
}
