import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { PageHeader, SectionCard } from "@/shared/components";
import { useListReveal } from "@/shared/hooks/useListReveal";

import { useRagManager } from "../hooks/useRagManager";
import { RagStatusCard } from "../components/RagStatusCard";
import { IndexFolderForm } from "../components/IndexFolderForm";
import { CollectionsList } from "../components/CollectionsList";

export default function RagPage() {
	const { t } = useTranslation("rag");
	const {
		status,
		collections,
		isLoading,
		isIndexing,
		progress,
		loadingName,
		deletingName,
		updatingName,
		filesByCollection,
		refresh,
		indexFolder,
		cancelIndex,
		loadCollection,
		deleteCollection,
		updateCollection,
		openCollectionFiles,
	} = useRagManager();

	const scope = useRef<HTMLDivElement>(null);
	useListReveal(scope, {
		deps: [isLoading, collections.length, status?.collectionName],
	});

	return (
		<div ref={scope} className="w-full px-4 sm:px-6 lg:px-8 pb-12">
			<PageHeader
				eyebrow={t("eyebrow")}
				title={t("title")}
				description={t("subtitle")}
			/>

			<div className="mt-2 flex flex-col gap-5 max-w-[820px]">
				<div data-stagger="1">
					<SectionCard flat contentClassName="p-0">
						<RagStatusCard
							status={status}
							isLoading={isLoading}
							onRefresh={refresh}
						/>
					</SectionCard>
				</div>

				<div data-stagger="2">
					<SectionCard flat contentClassName="p-0">
					<IndexFolderForm
						isIndexing={isIndexing}
						progress={progress}
						onSubmit={indexFolder}
						onCancel={cancelIndex}
					/>
					</SectionCard>
				</div>

				<div data-stagger="3">
					<SectionCard flat contentClassName="p-0">
						<CollectionsList
							collections={collections}
							activeName={status?.collectionName ?? null}
							loadingName={loadingName}
							deletingName={deletingName}
							updatingName={updatingName}
							filesByCollection={filesByCollection}
							isLoading={isLoading}
							onLoad={loadCollection}
							onUpdate={updateCollection}
							onDelete={deleteCollection}
							onOpenFiles={openCollectionFiles}
						/>
					</SectionCard>
				</div>
			</div>
		</div>
	);
}
