import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Check,
	ChevronDown,
	Database,
	FileText,
	Library,
	RefreshCw,
	Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/shared/components";
import type { RagCollection } from "../types/rag";
import type { CollectionFilesState } from "../hooks/useRagManager";

type CollectionsListProps = {
	collections: RagCollection[];
	activeName: string | null;
	loadingName: string | null;
	deletingName: string | null;
	updatingName: string | null;
	filesByCollection: Record<string, CollectionFilesState>;
	isLoading: boolean;
	onLoad: (name: string) => void;
	onUpdate: (name: string) => void;
	onDelete: (name: string) => void;
	onOpenFiles: (name: string) => void;
};

export function CollectionsList({
	collections,
	activeName,
	loadingName,
	deletingName,
	updatingName,
	filesByCollection,
	isLoading,
	onLoad,
	onUpdate,
	onDelete,
	onOpenFiles,
}: CollectionsListProps) {
	const { t } = useTranslation("rag");
	const [openName, setOpenName] = useState<string | null>(null);

	const toggleOpen = (name: string) => {
		if (openName === name) {
			setOpenName(null);
			return;
		}
		setOpenName(name);
		onOpenFiles(name);
	};

	return (
		<div className="flex flex-col gap-3 p-5">
			<div className="flex items-center gap-2">
				<span className="grid size-7 place-items-center rounded-[var(--radius-sm)] bg-surface-muted text-muted-foreground ring-1 ring-inset ring-border">
					<Library className="size-3.5" strokeWidth={1.7} />
				</span>
				<h2 className="text-[0.9375rem] font-medium text-foreground">
					{t("collections.title")}
				</h2>
			</div>

			{isLoading && collections.length === 0 ? (
				<div className="flex items-center gap-2 py-6 text-[0.8125rem] text-muted-foreground">
					<Spinner className="size-4" />
					<span>{t("collections.loading")}</span>
				</div>
			) : collections.length === 0 ? (
				<EmptyState
					icon={Database}
					title={t("collections.empty")}
					description={t("collections.emptyDescription")}
				/>
			) : (
				<div className="flex flex-col rounded-[var(--radius-xl)] border border-border bg-card overflow-hidden divide-y divide-border">
					{collections.map((c) => {
						const active = c.name === activeName;
						const busy = c.name === loadingName;
						const deleting = c.name === deletingName;
						const updating = c.name === updatingName;
						const isOpen = openName === c.name;
						const files = filesByCollection[c.name];

						return (
							<div key={c.name} className="flex flex-col">
								<div className="flex items-center justify-between gap-3 px-4 py-3">
									<div className="flex items-center gap-3 min-w-0">
										<span
											className={cn(
												"grid size-8 place-items-center rounded-[var(--radius-sm)] shrink-0 ring-1 ring-inset",
												active
													? "bg-ai-tint text-ai ring-ai/20"
													: "bg-surface-muted text-muted-foreground ring-border",
											)}
										>
											<Database
												className="size-4"
												strokeWidth={1.6}
											/>
										</span>
										<div className="flex flex-col min-w-0">
											<span className="text-[0.875rem] font-medium text-foreground truncate font-mono">
												{c.name}
											</span>
											<span className="text-[0.75rem] text-muted-foreground">
												{t("collections.docCount", {
													count: c.count,
												})}
											</span>
										</div>
									</div>

									<div className="flex items-center gap-1.5 shrink-0">
										{active ? (
											<Badge
												variant="secondary"
												className="gap-1 bg-ai-tint text-ai ring-1 ring-inset ring-ai/20"
											>
												<Check
													className="size-3"
													strokeWidth={2}
												/>
												{t("collections.loaded")}
											</Badge>
										) : (
											<Button
												size="sm"
												variant="outline"
												onClick={() => onLoad(c.name)}
												disabled={busy || deleting}
												className="gap-1.5"
											>
												{busy ? (
													<Spinner className="size-3.5" />
												) : null}
												<span>{t("collections.load")}</span>
											</Button>
										)}

										<Button
											size="sm"
											variant="ghost"
											onClick={() => onUpdate(c.name)}
											disabled={updating || deleting}
											aria-label={t("collections.update")}
											title={t("collections.updateHint")}
											className="gap-1.5"
										>
											<RefreshCw
												className={cn(
													"size-3.5",
													updating && "animate-spin",
												)}
												strokeWidth={1.7}
											/>
											<span className="hidden sm:inline">
												{t("collections.update")}
											</span>
										</Button>

										<Button
											size="sm"
											variant="ghost"
											onClick={() => toggleOpen(c.name)}
											aria-expanded={isOpen}
											aria-label={t("collections.open")}
											className="gap-1.5"
										>
											<ChevronDown
												className={cn(
													"size-3.5 transition-transform duration-[var(--duration-fast)]",
													isOpen && "rotate-180",
												)}
												strokeWidth={1.7}
											/>
											<span className="hidden sm:inline">
												{t("collections.open")}
											</span>
										</Button>

										<Button
											size="icon"
											variant="ghost"
											onClick={() => onDelete(c.name)}
											disabled={deleting}
											aria-label={t("collections.delete")}
											className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
										>
											{deleting ? (
												<Spinner className="size-3.5" />
											) : (
												<Trash2
													className="size-3.5"
													strokeWidth={1.6}
												/>
											)}
										</Button>
									</div>
								</div>

								{isOpen ? (
									<div className="bg-surface-muted/40 px-4 py-3 border-t border-border">
										<div className="mb-2 text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
											{t("collections.files")}
										</div>
										{files?.isLoading ? (
											<div className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground py-1">
												<Spinner className="size-3.5" />
												<span>
													{t("collections.filesLoading")}
												</span>
											</div>
										) : files?.error ? (
											<p className="text-[0.8125rem] text-destructive">
												{files.error}
											</p>
										) : files && files.files.length > 0 ? (
											<ul className="flex flex-col gap-1">
												{files.files.map((f) => (
													<li
														key={f.file_path ?? f.file_name}
														className="flex items-center gap-2 text-[0.8125rem] text-foreground"
														title={f.file_path ?? f.file_name}
													>
														<FileText
															className="size-3.5 text-muted-foreground shrink-0"
															strokeWidth={1.6}
														/>
														<span className="truncate font-mono">
															{f.file_name}
														</span>
													</li>
												))}
											</ul>
										) : (
											<p className="text-[0.8125rem] text-muted-foreground">
												{t("collections.filesEmpty")}
											</p>
										)}
									</div>
								) : null}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
