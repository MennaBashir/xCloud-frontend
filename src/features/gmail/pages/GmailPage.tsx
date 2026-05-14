import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/shared/components";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

import { useListReveal } from "@/shared/hooks/useListReveal";
import { useThreads } from "../hooks/useThreads";
import { useGmailStore } from "../store/gmailStore";
import { toggleStar } from "../mock/mockGmailService";
import { FolderRail } from "../components/FolderRail";
import { MobileFolderPills } from "../components/MobileFolderPills";
import { InboxToolbar } from "../components/InboxToolbar";
import { ThreadList } from "../components/ThreadList";
import { ThreadView } from "../components/ThreadView";
import { ComposeDrawer } from "../components/ComposeDrawer";

export default function GmailPage() {
	const { t } = useTranslation("gmail");
	const { threads, counts, loading, refresh } = useThreads();
	const openCompose = useGmailStore((s) => s.openCompose);
	const selectedThreadId = useGmailStore((s) => s.selectedThreadId);
	const selectThread = useGmailStore((s) => s.selectThread);
	const listScope = useRef<HTMLDivElement>(null);
	useListReveal(listScope, { deps: [threads.length, loading] });

	const handleToggleStar = async (id: string) => {
		await toggleStar(id);
		refresh();
	};

	const showThreadOnMobile = selectedThreadId !== null;

	return (
		<div className="w-full px-4 sm:px-6 lg:px-8 pb-10">
			<PageHeader
				eyebrow={t("title")}
				title={t("title")}
				description={t("subtitle")}
				actions={
					<Button onClick={() => openCompose()} className="gap-2">
						<Send className="size-3.5 rtl-flip" strokeWidth={1.6} />
						<span>{t("actions.compose")}</span>
					</Button>
				}
			/>

			<MobileFolderPills counts={counts} />

			<div
				ref={listScope}
				data-stagger="1"
				className="flex items-start gap-4 lg:gap-5"
			>
				<FolderRail counts={counts} />

				<div
					className={cn(
						"flex-1 min-w-0",
						"rounded-[var(--radius-2xl)] border border-border bg-card overflow-hidden",
						"grid grid-cols-1 lg:grid-cols-[360px_1fr]",
					)}
					style={{ height: "calc(100dvh - 12rem)", maxHeight: "780px" }}
				>
					{/* Thread list pane — hidden on mobile when a thread is open */}
					<div
						className={cn(
							"flex flex-col min-h-0 border-b lg:border-b-0 lg:border-e border-border min-w-0 overflow-hidden",
							showThreadOnMobile && "hidden lg:flex",
						)}
					>
						<InboxToolbar />
						<div className="flex-1 min-h-0 overflow-y-auto">
							<ThreadList
								threads={threads}
								loading={loading}
								onToggleStar={handleToggleStar}
							/>
						</div>
					</div>

					{/* Thread view pane — hidden on mobile when no thread is selected */}
					<div
						className={cn(
							"flex flex-col min-h-0 min-w-0 overflow-hidden",
							!showThreadOnMobile && "hidden lg:flex",
						)}
					>
						<ThreadView
							onRefresh={refresh}
							onBack={() => selectThread(null)}
						/>
					</div>
				</div>
			</div>

			<ComposeDrawer onSent={refresh} />
		</div>
	);
}
