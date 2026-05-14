import { useTranslation } from "react-i18next";
import {
	ArrowDown,
	ArrowUp,
	Filter,
	LayoutGrid,
	List,
	Search,
	X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useFilesStore } from "../store/filesStore";
import type { FileKind, SortField } from "../types/file";

const SORTABLE: Array<{ field: SortField; labelKey: string }> = [
	{ field: "updatedAt", labelKey: "sort.updatedAt" },
	{ field: "name", labelKey: "sort.name" },
	{ field: "size", labelKey: "sort.size" },
];

const KIND_FILTERS: FileKind[] = [
	"recording",
	"transcript",
	"deck",
	"note",
	"task",
	"pdf",
	"doc",
	"image",
	"video",
	"audio",
];

export function FilesToolbar() {
	const { t } = useTranslation("files");

	const query = useFilesStore((s) => s.query);
	const setQuery = useFilesStore((s) => s.setQuery);
	const kinds = useFilesStore((s) => s.kinds);
	const toggleKind = useFilesStore((s) => s.toggleKind);
	const clearKinds = useFilesStore((s) => s.clearKinds);
	const sortField = useFilesStore((s) => s.sortField);
	const sortDirection = useFilesStore((s) => s.sortDirection);
	const setSort = useFilesStore((s) => s.setSort);
	const viewMode = useFilesStore((s) => s.viewMode);
	const setViewMode = useFilesStore((s) => s.setViewMode);

	const filtersApplied = kinds.length;

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
			{/* Search */}
			<div className="relative flex-1 max-w-[420px]">
				<Search
					className="absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
					strokeWidth={1.6}
				/>
				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={t("search.placeholder")}
					aria-label={t("search.placeholder")}
					className={cn(
						"w-full h-10 ps-10 pe-3 rounded-[var(--radius-md)]",
						"bg-surface-elevated border border-border",
						"text-[0.9375rem] text-foreground placeholder:text-muted-foreground/70",
						"transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
						"outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
						"hover:border-border-strong",
						"dark:bg-surface-muted/60",
					)}
				/>
				{query ? (
					<button
						type="button"
						onClick={() => setQuery("")}
						aria-label="Clear search"
						className="absolute end-2 top-1/2 -translate-y-1/2 grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
					>
						<X className="size-3.5" strokeWidth={1.6} />
					</button>
				) : null}
			</div>

			<div className="flex items-center gap-2 ms-auto flex-wrap">
				{/* Filter */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm" className="gap-2">
							<Filter className="size-3.5" strokeWidth={1.6} />
							<span>{t("filters.label")}</span>
							{filtersApplied > 0 ? (
								<span className="inline-flex items-center justify-center rounded-full bg-foreground text-background text-[0.6875rem] font-medium min-w-5 h-5 px-1.5">
									{filtersApplied}
								</span>
							) : null}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="min-w-[14rem] rounded-[var(--radius-lg)]"
					>
						<DropdownMenuLabel className="text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
							{t("filters.kind")}
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{KIND_FILTERS.map((kind) => (
							<DropdownMenuCheckboxItem
								key={kind}
								checked={kinds.includes(kind)}
								onCheckedChange={() => toggleKind(kind)}
								className="cursor-pointer"
							>
								<span>{t(`kinds.${kind}`)}</span>
							</DropdownMenuCheckboxItem>
						))}
						{filtersApplied > 0 ? (
							<>
								<DropdownMenuSeparator />
								<button
									type="button"
									onClick={() => clearKinds()}
									className="w-full text-start px-2 py-1.5 text-[0.8125rem] text-muted-foreground hover:bg-accent hover:text-foreground rounded-[var(--radius-xs)] transition-colors"
								>
									{t("actions.clearFilters")}
								</button>
							</>
						) : null}
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Sort */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm" className="gap-2">
							{sortDirection === "asc" ? (
								<ArrowUp className="size-3.5" strokeWidth={1.6} />
							) : (
								<ArrowDown className="size-3.5" strokeWidth={1.6} />
							)}
							<span className="hidden xs:inline">
								{t("sort.label")}:
							</span>{" "}
							{t(`sort.${sortField}`)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="min-w-[12rem] rounded-[var(--radius-lg)]"
					>
						<DropdownMenuLabel className="text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
							{t("sort.label")}
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup
							value={sortField}
							onValueChange={(v) =>
								setSort(v as SortField, sortDirection)
							}
						>
							{SORTABLE.map((opt) => (
								<DropdownMenuRadioItem
									key={opt.field}
									value={opt.field}
									className="cursor-pointer"
								>
									{t(opt.labelKey)}
								</DropdownMenuRadioItem>
							))}
						</DropdownMenuRadioGroup>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup
							value={sortDirection}
							onValueChange={(v) =>
								setSort(sortField, v as "asc" | "desc")
							}
						>
							<DropdownMenuRadioItem value="desc" className="cursor-pointer">
								<ArrowDown className="size-3" strokeWidth={1.6} />
								<span>{t("sort.desc")}</span>
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="asc" className="cursor-pointer">
								<ArrowUp className="size-3" strokeWidth={1.6} />
								<span>{t("sort.asc")}</span>
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* View toggle */}
				<div
					role="radiogroup"
					aria-label="View mode"
					className="inline-flex items-center gap-0.5 rounded-full border border-border bg-surface-muted p-0.5"
				>
					<button
						type="button"
						role="radio"
						aria-checked={viewMode === "list"}
						aria-label={t("actions.viewList")}
						onClick={() => setViewMode("list")}
						className={cn(
							"grid size-7 place-items-center rounded-full transition-all duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
							"active:scale-[0.96]",
							viewMode === "list"
								? "bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-border-strong"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						<List className="size-3.5" strokeWidth={1.6} />
					</button>
					<button
						type="button"
						role="radio"
						aria-checked={viewMode === "grid"}
						aria-label={t("actions.viewGrid")}
						onClick={() => setViewMode("grid")}
						className={cn(
							"grid size-7 place-items-center rounded-full transition-all duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
							"active:scale-[0.96]",
							viewMode === "grid"
								? "bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-border-strong"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						<LayoutGrid className="size-3.5" strokeWidth={1.6} />
					</button>
				</div>
			</div>
		</div>
	);
}


