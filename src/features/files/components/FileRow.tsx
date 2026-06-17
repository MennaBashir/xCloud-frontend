import { useTranslation } from "react-i18next";
import { Eye, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/shared/i18n/LanguageProvider";

import { FileKindIcon } from "./FileKindIcon";
import { formatBytes, formatDate, relativeTime } from "./file-meta";
import type { FileItem } from "../types/file";

type FileRowProps = {
	file: FileItem;
	onShow: (file: FileItem) => void;
	loading: boolean;
};

export function FileRow({ file, onShow, loading }: FileRowProps) {
	const { t } = useTranslation("files");
	const { language } = useLanguage();
	const size = formatBytes(file.sizeBytes);
	const updated = relativeTime(file.updatedAt, (k, opts) =>
		t(k, opts as Record<string, unknown>),
	);
	const created = formatDate(file.createdAt, language);

	return (
		<div
			role="row"
			data-list-item
			className={cn(
				"group/row grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_150px_100px_150px_120px] items-center gap-3 sm:gap-4",
				"px-3 sm:px-4 py-2.5 sm:py-3 min-h-[52px] sm:min-h-[60px] rounded-[var(--radius-md)]",
				"border border-transparent hover:border-border hover:bg-accent/40",
				"transition-[background-color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
			)}
		>
			{/* Name + icon */}
			<div className="flex items-center gap-3 min-w-0">
				<FileKindIcon kind={file.kind} size="md" />
				<div className="min-w-0 flex-1">
					<span className="block truncate text-[0.9375rem] font-medium text-foreground">
						{file.name}
					</span>
					<span className="mt-0.5 block text-[0.75rem] text-muted-foreground">
						{t(`kinds.${file.kind}`)}
					</span>
				</div>
			</div>

			{/* Updated */}
			<span className="hidden sm:inline text-[0.8125rem] text-muted-foreground">
				{updated}
			</span>

			{/* Size */}
			<span className="hidden sm:inline font-mono text-[0.75rem] text-muted-foreground tabular-nums">
				{size.value} {size.unit}
			</span>

			{/* Created */}
			<span className="hidden sm:inline text-[0.8125rem] text-muted-foreground truncate">
				{created}
			</span>

			{/* Show file */}
			<div className="flex justify-end sm:justify-start">
				<Button
					size="sm"
					variant="outline"
					className="gap-2"
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
