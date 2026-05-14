import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CloudUpload, FileUp } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useFilesStore } from "../store/filesStore";
import {
	DEMO_OWNER,
	inferKindFromName,
	uploadFile,
} from "../mock/mockFilesService";

type UploadDialogProps = {
	onUploaded?: () => void;
};

export function UploadDialog({ onUploaded }: UploadDialogProps) {
	const { t } = useTranslation("files");
	const open = useFilesStore((s) => s.uploadDialogOpen);
	const close = useFilesStore((s) => s.closeUpload);
	const inputRef = useRef<HTMLInputElement>(null);
	const [dragOver, setDragOver] = useState(false);
	const [busy, setBusy] = useState(false);

	const handleFiles = async (files: FileList | null) => {
		if (!files || files.length === 0) return;
		setBusy(true);
		try {
			for (const f of Array.from(files)) {
				toast(t("upload.uploading", { name: f.name }));
				await uploadFile({
					name: f.name,
					sizeBytes: f.size,
					kind: inferKindFromName(f.name),
					owner: DEMO_OWNER,
				});
			}
			toast.success(t("upload.success", { count: files.length }));
			onUploaded?.();
			close();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setBusy(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!o) close();
			}}
		>
			<DialogContent className="sm:max-w-[480px] rounded-[var(--radius-2xl)]">
				<DialogHeader>
					<DialogTitle className="text-[1.125rem] font-semibold tracking-tight">
						{t("upload.title")}
					</DialogTitle>
					<DialogDescription className="text-[0.875rem] text-muted-foreground leading-relaxed">
						{t("upload.description")}
					</DialogDescription>
				</DialogHeader>

				<div
					onDragOver={(e) => {
						e.preventDefault();
						setDragOver(true);
					}}
					onDragLeave={() => setDragOver(false)}
					onDrop={(e) => {
						e.preventDefault();
						setDragOver(false);
						void handleFiles(e.dataTransfer.files);
					}}
					className={cn(
						"relative flex flex-col items-center justify-center gap-3 text-center",
						"min-h-[180px] rounded-[var(--radius-lg)]",
						"border-2 border-dashed transition-colors duration-[var(--duration-fast)]",
						dragOver
							? "border-ai bg-ai-tint"
							: "border-border bg-surface-muted/40",
					)}
				>
					<div className="grid size-12 place-items-center rounded-full bg-card border border-border text-foreground">
						<CloudUpload className="size-5" strokeWidth={1.6} />
					</div>
					<p className="text-[0.9375rem] font-medium text-foreground">
						{dragOver ? t("upload.dropHere") : t("upload.description")}
					</p>

					<Button
						type="button"
						size="sm"
						variant="outline"
						className="gap-2 mt-1"
						disabled={busy}
						onClick={() => inputRef.current?.click()}
					>
						<FileUp className="size-3.5" strokeWidth={1.6} />
						<span>{t("upload.chooseFiles")}</span>
					</Button>

					<input
						ref={inputRef}
						type="file"
						multiple
						hidden
						onChange={(e) => void handleFiles(e.target.files)}
					/>
				</div>

				<DialogFooter className="sm:justify-end">
					<Button variant="ghost" size="sm" onClick={() => close()}>
						{t("upload.close")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
