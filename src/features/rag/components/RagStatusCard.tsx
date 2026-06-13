import { useTranslation } from "react-i18next";
import { CheckCircle2, Database, RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { RagStatus } from "../types/rag";

type RagStatusCardProps = {
	status: RagStatus | null;
	isLoading: boolean;
	onRefresh: () => void;
};

export function RagStatusCard({
	status,
	isLoading,
	onRefresh,
}: RagStatusCardProps) {
	const { t } = useTranslation("rag");
	const loaded = status?.isLoaded ?? false;

	return (
		<div className="flex items-center justify-between gap-4 p-5">
			<div className="flex items-center gap-3 min-w-0">
				<span
					className={cn(
						"grid size-10 place-items-center rounded-[var(--radius-md)] shrink-0 ring-1 ring-inset",
						loaded
							? "bg-ai-tint text-ai ring-ai/20"
							: "bg-surface-muted text-muted-foreground ring-border",
					)}
				>
					{loaded ? (
						<CheckCircle2 className="size-5" strokeWidth={1.7} />
					) : (
						<Database className="size-5" strokeWidth={1.6} />
					)}
				</span>
				<div className="flex flex-col min-w-0">
					<span className="text-[0.75rem] uppercase tracking-[0.16em] text-muted-foreground">
						{t("status.label")}
					</span>
					{isLoading ? (
						<span className="text-[0.9375rem] font-medium text-muted-foreground">
							{t("status.checking")}
						</span>
					) : loaded ? (
						<span className="text-[0.9375rem] font-medium text-foreground truncate">
							{t("status.active", {
								collection: status?.collectionName ?? "—",
							})}
						</span>
					) : (
						<span className="text-[0.9375rem] font-medium text-foreground">
							{t("status.none")}
						</span>
					)}
				</div>
			</div>

			<Button
				size="sm"
				variant="outline"
				onClick={onRefresh}
				disabled={isLoading}
				className="gap-2 shrink-0"
			>
				{isLoading ? (
					<Spinner className="size-3.5" />
				) : (
					<RefreshCw className="size-3.5" strokeWidth={1.6} />
				)}
				<span>{t("status.refresh")}</span>
			</Button>
		</div>
	);
}
