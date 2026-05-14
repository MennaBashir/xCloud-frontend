import { Skeleton } from "@/components/ui/skeleton";

import { FileCard } from "./FileCard";
import type { FileItem } from "../types/file";

type FilesGridProps = {
	items: FileItem[];
	loading: boolean;
	onOpen: (file: FileItem) => void;
	onDelete: (file: FileItem) => void;
};

export function FilesGrid({ items, loading, onOpen, onDelete }: FilesGridProps) {
	if (loading) {
		return (
			<div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
				{Array.from({ length: 8 }).map((_, i) => (
					<div
						key={i}
						className="rounded-[var(--radius-xl)] border border-border bg-card p-4 flex flex-col gap-3"
					>
						<div className="flex items-start justify-between">
							<Skeleton className="size-14 rounded-[var(--radius-md)]" />
							<Skeleton className="size-8 rounded-[var(--radius-sm)]" />
						</div>
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-3 w-1/2" />
						<div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
							<Skeleton className="h-3 w-16" />
							<Skeleton className="h-3 w-10" />
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
			{items.map((file) => (
				<FileCard
					key={file.id}
					file={file}
					onOpen={onOpen}
					onDelete={onDelete}
				/>
			))}
		</div>
	);
}
