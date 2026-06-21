import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { FolderOpen, Search } from "lucide-react";

import { PageHeader, EmptyState } from "@/shared/components";
import { Button } from "@/components/ui/button";
import { useListReveal } from "@/shared/hooks/useListReveal";

import { CategoryTabs } from "../components/CategoryTabs";
import { FilesToolbar } from "../components/FilesToolbar";
import { FilesList } from "../components/FilesList";
import { FilesGrid } from "../components/FilesGrid";
import { useFiles } from "../hooks/useFiles";
import { useFilesStore } from "../store/filesStore";

export function FilesPage() {
	const { t } = useTranslation("files");
	const viewMode = useFilesStore((s) => s.viewMode);
	const query = useFilesStore((s) => s.query);
	const kinds = useFilesStore((s) => s.kinds);
	const setQuery = useFilesStore((s) => s.setQuery);
	const clearKinds = useFilesStore((s) => s.clearKinds);

	const { items, availableKinds, loading, error } = useFiles();
	const listScope = useRef<HTMLDivElement>(null);
	useListReveal(listScope, {
		deps: [items.length, viewMode, loading],
	});

	const hasActiveFilters = query.length > 0 || kinds.length > 0;
	const isFiltered = items.length === 0 && hasActiveFilters;

	return (
		<div className="container mx-auto px-4 sm:px-6 pb-16">
			<PageHeader
				eyebrow={t("title")}
				title={t("title")}
				description={t("subtitle")}
			/>

			<div ref={listScope} className="flex flex-col gap-5">
				<div data-stagger="1">
					<CategoryTabs />
				</div>
				<div data-stagger="2">
					<FilesToolbar availableKinds={availableKinds} />
				</div>

				<div data-stagger="3">
					{loading || items.length > 0 ? (
						viewMode === "list" ? (
							<FilesList items={items} loading={loading} />
						) : (
							<FilesGrid items={items} loading={loading} />
						)
					) : error ? (
						<EmptyState
							icon={FolderOpen}
							title={t("empty.errorTitle")}
							description={error}
						/>
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
									}}
								>
									{t("actions.clearFilters")}
								</Button>
							}
						/>
					) : (
						<EmptyState
							icon={FolderOpen}
							title={t("empty.title")}
							description={t("empty.description")}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default FilesPage;
