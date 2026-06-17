import { useEffect } from "react";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";

import { FileCard } from "./FileCard";
import { useFilePreview } from "./FilePreview";
import type { FileItem } from "../types/file";

type FilesGridProps = {
	items: FileItem[];
	loading: boolean;
};

export function FilesGrid({ items, loading }: FilesGridProps) {
	const preview = useFilePreview();

	useEffect(() => {
		if (preview.error) toast.error(preview.error);
	}, [preview.error]);

	if (loading) {
		return (
			<div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
				{Array.from({ length: 8 }).map((_, i) => (
					<div
						key={i}
						className="rounded-[var(--radius-xl)] border border-border bg-card p-4 flex flex-col gap-3"
					>
						<Skeleton className="size-14 rounded-[var(--radius-md)]" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-3 w-1/2" />
						<div className="mt-auto pt-3 border-t border-border">
							<Skeleton className="h-8 w-full rounded-[var(--radius-md)]" />
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
				{items.map((file) => (
					<FileCard
						key={file.id}
						file={file}
						onShow={(f) => void preview.open(f.path)}
						loading={preview.loadingPath === file.path}
					/>
				))}
			</div>

			{preview.dialog}
		</>
	);
}
