import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CloudUpload, Search } from "lucide-react";

import { PageHeader, EmptyState } from "@/shared/components";
import { Button } from "@/components/ui/button";
import { useListReveal } from "@/shared/hooks/useListReveal";

import { CategoryTabs } from "../components/CategoryTabs";
import { FilesToolbar } from "../components/FilesToolbar";
import { FilesList } from "../components/FilesList";
import { FilesGrid } from "../components/FilesGrid";
import { FilePreviewDrawer } from "../components/FilePreviewDrawer";
import { UploadDialog } from "../components/UploadDialog";
import { useFiles } from "../hooks/useFiles";
import { useFilesStore } from "../store/filesStore";
import { deleteFile } from "../mock/mockFilesService";
import type { FileItem } from "../types/file";

export function FilesPage() {
	const { t } = useTranslation("files");
	const viewMode = useFilesStore((s) => s.viewMode);
	const openPreview = useFilesStore((s) => s.openPreview);
	const openUpload = useFilesStore((s) => s.openUpload);
	const query = useFilesStore((s) => s.query);
	const kinds = useFilesStore((s) => s.kinds);
	const setQuery = useFilesStore((s) => s.setQuery);
	const clearKinds = useFilesStore((s) => s.clearKinds);
	const setCategory = useFilesStore((s) => s.setCategory);

	const { items, loading, refresh } = useFiles();
	const listScope = useRef<HTMLDivElement>(null);
	useListReveal(listScope, {
		deps: [items.length, viewMode, loading],
	});

	const handleDelete = useCallback(
		async (file: FileItem) => {
			await deleteFile(file.id);
			toast.success(`Deleted "${file.name}"`);
			refresh();
		},
		[refresh],
	);

	const hasActiveFilters = query.length > 0 || kinds.length > 0;
	const isFiltered = items.length === 0 && hasActiveFilters;

	return (
		<div className="container mx-auto px-4 sm:px-6 pb-16">
			<PageHeader
				eyebrow={t("title")}
				title={t("title")}
				description={t("subtitle")}
				actions={
					<Button onClick={() => openUpload()} className="gap-2">
						<CloudUpload className="size-3.5" strokeWidth={1.6} />
						<span>{t("actions.upload")}</span>
					</Button>
				}
			/>

			<div ref={listScope} className="flex flex-col gap-5">
				<div data-stagger="1">
					<CategoryTabs />
				</div>
				<div data-stagger="2">
					<FilesToolbar />
				</div>

				<div data-stagger="3">
					{loading || items.length > 0 ? (
						viewMode === "list" ? (
							<FilesList
								items={items}
								loading={loading}
								onOpen={openPreview}
								onDelete={handleDelete}
							/>
						) : (
							<FilesGrid
								items={items}
								loading={loading}
								onOpen={openPreview}
								onDelete={handleDelete}
							/>
						)
					) : isFiltered ? (
						<EmptyState
							icon={Search}
							title={t("empty.noResultsTitle")}
							description={t("empty.noResultsDescription")}
							action={
								<Button
									size="sm"
									variant="outline"
									onClick={() => {
										setQuery("");
										clearKinds();
										setCategory("all");
									}}
								>
									{t("actions.clearFilters")}
								</Button>
							}
						/>
					) : (
						<EmptyState
							icon={CloudUpload}
							title={t("empty.title")}
							description={t("empty.description")}
							action={
								<Button onClick={() => openUpload()} className="gap-2">
									<CloudUpload
										className="size-3.5"
										strokeWidth={1.6}
									/>
									<span>{t("empty.action")}</span>
								</Button>
							}
						/>
					)}
				</div>
			</div>

			<FilePreviewDrawer onDelete={handleDelete} />
			<UploadDialog onUploaded={refresh} />
		</div>
	);
}

export default FilesPage;
