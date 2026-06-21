import { useTranslation } from "react-i18next";
import { Eye, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/shared/i18n/LanguageProvider";

import { FileKindIcon } from "./FileKindIcon";
import { formatBytes, formatDate, relativeTime } from "./file-meta";
import type { FileItem } from "../types/file";

type FileCardProps = {
	file: FileItem;
	onShow: (file: FileItem) => void;
	loading: boolean;
};

export function FileCard({ file, onShow, loading }: FileCardProps) {
	const { t } = useTranslation("files");
	const { language } = useLanguage();
	const size = formatBytes(file.sizeBytes);
	const updated = relativeTime(file.updatedAt, (k, opts) =>
		t(k, opts as Record<string, unknown>),
	);
	const created = formatDate(file.createdAt, language);

	return (
		<div
			data-list-item
			className={cn(
				"group/card relative flex flex-col gap-3",
				"rounded-[var(--radius-xl)] border border-border bg-card",
				"p-4",
				"transition-[transform,border-color,box-shadow] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
				"hover:border-border-strong hover:-translate-y-0.5 hover:shadow-[0_1px_2px_oklch(0_0_0/0.03),0_16px_32px_-18px_oklch(0_0_0/0.12)]",
			)}
		>
			<FileKindIcon kind={file.kind} size="lg" />

			{/* Name */}
			<div className="flex flex-col gap-1 min-w-0">
				<h3 className="truncate text-[0.9375rem] font-medium text-foreground leading-tight">
					{file.name}
				</h3>
				<span className="text-[0.75rem] text-muted-foreground">
					{t(`kinds.${file.kind}`)}
				</span>
			</div>

			{/* Meta */}
			<dl className="flex flex-col gap-1.5 text-[0.75rem]">
				<div className="flex items-center justify-between gap-2">
					<dt className="text-muted-foreground">{t("table.updated")}</dt>
					<dd className="text-foreground truncate">{updated}</dd>
				</div>
				<div className="flex items-center justify-between gap-2">
					<dt className="text-muted-foreground">{t("table.created")}</dt>
					<dd className="text-foreground truncate">{created}</dd>
				</div>
				<div className="flex items-center justify-between gap-2">
					<dt className="text-muted-foreground">{t("table.size")}</dt>
					<dd className="font-mono text-foreground tabular-nums">
						{size.value} {size.unit}
					</dd>
				</div>
			</dl>

			{/* Show file */}
			<div className="mt-auto pt-3 border-t border-border">
				<Button
					size="sm"
					variant="outline"
					className="w-full gap-2"
					onClick={() => onShow(file)}
					disabled={loading}
				>
					{loading ? (
						<Loader2 className="size-3.5 animate-spin" strokeWidth={1.6} />
					) : (
						<Eye className="size-3.5" strokeWidth={1.6} />
					)}
					<span>{t("preview.showContent")}</span>
				</Button>
			</div>
		</div>
	);
}
