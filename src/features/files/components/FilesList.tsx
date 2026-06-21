import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { FileRow } from "./FileRow";
import { useFilePreview } from "./FilePreview";
import type { FileItem } from "../types/file";

type FilesListProps = {
	items: FileItem[];
	loading: boolean;
};

export function FilesList({ items, loading }: FilesListProps) {
	const { t } = useTranslation("files");
	const preview = useFilePreview();

	useEffect(() => {
		if (preview.error) toast.error(preview.error);
	}, [preview.error]);

	return (
		<>
			<div className="rounded-[var(--radius-2xl)] border border-border bg-card overflow-hidden">
				{/* Header (sm+) */}
				<div className="hidden sm:grid grid-cols-[1fr_150px_100px_150px_120px] gap-4 px-4 py-2.5 border-b border-border bg-surface-muted/40 text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
					<span>{t("table.name")}</span>
					<span>{t("table.updated")}</span>
					<span>{t("table.size")}</span>
					<span>{t("table.created")}</span>
					<span className="sr-only">{t("preview.showContent")}</span>
				</div>

				<div className="p-1.5 flex flex-col gap-0.5">
					{loading ? (
						<SkeletonRows />
					) : (
						items.map((file) => (
							<FileRow
								key={file.id}
								file={file}
								onShow={(f) => void preview.open(f.path)}
								loading={preview.loadingPath === file.path}
							/>
						))
					)}
				</div>
			</div>

			{preview.dialog}
		</>
	);
}

function SkeletonRows() {
	return (
		<>
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_150px_100px_150px_120px] items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3"
				>
					<div className="flex items-center gap-3 min-w-0">
						<Skeleton className="size-10 rounded-[var(--radius-md)]" />
						<div className="flex flex-col gap-1.5 flex-1">
							<Skeleton className="h-3.5 w-2/5" />
							<Skeleton className="h-2.5 w-1/4" />
						</div>
					</div>
					<Skeleton className="hidden sm:block h-3 w-20" />
					<Skeleton className="hidden sm:block h-3 w-12" />
					<Skeleton className="hidden sm:block h-3 w-24" />
					<Skeleton className="h-8 w-24 rounded-[var(--radius-md)] justify-self-end sm:justify-self-start" />
				</div>
			))}
		</>
	);
}
