import { useTranslation } from "react-i18next";
import {
	Download,
	ExternalLink,
	Share2,
	Sparkles,
	Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { useLanguage } from "@/shared/i18n/LanguageProvider";

import { useFilesStore } from "../store/filesStore";
import { FileKindIcon } from "./FileKindIcon";
import { KIND_META, formatBytes, formatDate, relativeTime } from "./file-meta";
import type { FileItem } from "../types/file";

type FilePreviewDrawerProps = {
	onDelete: (file: FileItem) => void;
};

function initials(name: string) {
	return name
		.split(" ")
		.map((w) => w[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

export function FilePreviewDrawer({ onDelete }: FilePreviewDrawerProps) {
	const { t } = useTranslation("files");
	const { language, isRtl } = useLanguage();
	const file = useFilesStore((s) => s.previewFile);
	const close = useFilesStore((s) => s.closePreview);

	const open = file !== null;

	return (
		<Sheet open={open} onOpenChange={(o) => (o ? null : close())}>
			<SheetContent
				side={isRtl ? "left" : "right"}
				className="w-[28rem] sm:w-[32rem] max-w-[100vw] p-0 flex flex-col"
			>
				<SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
					<SheetTitle className="sr-only">
						{file?.name ?? ""}
					</SheetTitle>
					<SheetDescription className="sr-only">
						{t("preview.about")}
					</SheetDescription>

					{file ? (
						<div className="flex items-start gap-4">
							<FileKindIcon kind={file.kind} size="lg" />
							<div className="min-w-0 flex-1">
								<h2 className="text-[1.125rem] font-semibold tracking-tight text-foreground leading-tight break-words">
									{file.name}
								</h2>
								<p className="mt-1 text-[0.8125rem] text-muted-foreground">
									{t(KIND_META[file.kind].labelKey)} ·{" "}
									{(() => {
										const s = formatBytes(file.sizeBytes);
										return `${s.value} ${s.unit}`;
									})()}
								</p>
							</div>
						</div>
					) : null}
				</SheetHeader>

				{file ? (
					<>
						<div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
							{/* Action bar */}
							<div className="flex items-center gap-2 flex-wrap">
								<Button size="sm" className="gap-2">
									<Download className="size-3.5" strokeWidth={1.6} />
									<span>{t("actions.download")}</span>
								</Button>
								<Button size="sm" variant="outline" className="gap-2">
									<Share2 className="size-3.5" strokeWidth={1.6} />
									<span>{t("actions.share")}</span>
								</Button>
								{file.fromMeeting ? (
									<Button size="sm" variant="ai" className="gap-2">
										<ExternalLink
											className="size-3.5 rtl-flip"
											strokeWidth={1.6}
										/>
										<span>{t("actions.openMeeting")}</span>
									</Button>
								) : null}
							</div>

							{/* From-meeting callout */}
							{file.fromMeeting && file.meetingTitle ? (
								<div
									className={cn(
										"flex items-start gap-3 rounded-[var(--radius-lg)]",
										"border border-ai/25 bg-ai-tint px-4 py-3.5",
									)}
								>
									<Sparkles
										className="size-4 text-ai shrink-0 mt-0.5"
										strokeWidth={1.6}
									/>
									<div className="min-w-0">
										<p className="text-[0.8125rem] font-medium text-foreground">
											{t("meta.fromMeeting", { title: file.meetingTitle })}
										</p>
										<p className="text-[0.75rem] text-muted-foreground mt-0.5">
											{formatDate(file.createdAt, language)}
										</p>
									</div>
								</div>
							) : null}

							{/* About */}
							<section className="flex flex-col gap-3">
								<h3 className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
									{t("preview.about")}
								</h3>

								<dl className="grid grid-cols-3 gap-x-4 gap-y-3 text-[0.875rem]">
									<MetaRow
										label={t("preview.details.type")}
										value={t(KIND_META[file.kind].labelKey)}
									/>
									<MetaRow
										label={t("preview.details.size")}
										value={(() => {
											const s = formatBytes(file.sizeBytes);
											return `${s.value} ${s.unit}`;
										})()}
									/>
									<MetaRow
										label={t("preview.details.updated")}
										value={relativeTime(file.updatedAt, (k, opts) =>
											t(k, opts as Record<string, unknown>),
										)}
									/>
									<MetaRow
										label={t("preview.details.created")}
										value={formatDate(file.createdAt, language)}
										span={3}
									/>
								</dl>
							</section>

							{/* Owner */}
							<section className="flex flex-col gap-3">
								<h3 className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
									{t("preview.details.owner")}
								</h3>
								<div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border p-3">
									<Avatar className="size-9 shrink-0">
										<AvatarImage src={file.owner.avatarUrl} alt="" />
										<AvatarFallback className="bg-surface-muted text-foreground text-[0.75rem] font-medium">
											{initials(file.owner.name)}
										</AvatarFallback>
									</Avatar>
									<div className="min-w-0">
										<div className="text-[0.875rem] font-medium text-foreground truncate">
											{file.owner.name}
										</div>
										<div className="text-[0.75rem] text-muted-foreground truncate">
											{file.owner.email}
										</div>
									</div>
								</div>
							</section>

							{/* Tags */}
							{file.tags.length > 0 ? (
								<section className="flex flex-col gap-3">
									<h3 className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
										{t("preview.details.tags")}
									</h3>
									<div className="flex items-center gap-1.5 flex-wrap">
										{file.tags.map((tag) => (
											<span
												key={tag}
												className="inline-flex items-center rounded-full bg-surface-muted text-foreground px-2.5 py-1 text-[0.75rem] font-medium border border-border"
											>
												{tag}
											</span>
										))}
									</div>
								</section>
							) : null}
						</div>

						<footer className="border-t border-border px-6 py-4 flex items-center justify-end">
							<Button
								size="sm"
								variant="ghost"
								className="text-destructive hover:bg-destructive/10 gap-2"
								onClick={() => {
									onDelete(file);
									close();
								}}
							>
								<Trash2 className="size-3.5" strokeWidth={1.6} />
								<span>{t("actions.delete")}</span>
							</Button>
						</footer>
					</>
				) : null}
			</SheetContent>
		</Sheet>
	);
}

function MetaRow({
	label,
	value,
	span = 1,
}: {
	label: string;
	value: string;
	span?: 1 | 3;
}) {
	return (
		<div
			className={cn(
				"flex flex-col gap-0.5",
				span === 3 ? "col-span-3" : "col-span-3 sm:col-span-1",
			)}
		>
			<dt className="text-[0.6875rem] text-muted-foreground">{label}</dt>
			<dd className="text-foreground">{value}</dd>
		</div>
	);
}
