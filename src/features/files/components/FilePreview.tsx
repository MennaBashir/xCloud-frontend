import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { HardDrive } from "lucide-react";

import { ApiError } from "@/shared/api";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { FileViewerDialog } from "./FileViewerDialog";
import { inferKindFromName } from "../services/filesService";
import { viewFile, type FileContent } from "../services/filesService";
import type { FileItem } from "../types/file";

/** Build a lightweight FileItem from just an absolute server path. */
function fileItemFromPath(path: string): FileItem {
	const name = path.split(/[/\\]/).pop() || path;
	return {
		id: path,
		path,
		name,
		kind: inferKindFromName(name),
		mimeType: null,
		sizeBytes: 0,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
}

type FilePreviewState = {
	open: (path: string) => void;
	openInNewTab: (path: string) => void;
	loadingPath: string | null;
	error: string | null;
	dialog: React.ReactNode;
};

/** Turn a fetched FileContent into a Blob so it can be opened in a new tab. */
function contentToBlob(content: FileContent): Blob {
	const type = content.mime_type || "application/octet-stream";
	if (content.encoding === "base64") {
		const binary = atob(content.content);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i);
		}
		return new Blob([bytes], { type });
	}
	return new Blob([content.content], {
		type: type.startsWith("text/") ? type : "text/plain;charset=utf-8",
	});
}

/**
 * Headless-ish controller for previewing a file by path anywhere in the app
 * (chat citations, files list, etc.). It fetches `/files/view` and renders
 * the shared elegant `FileViewerDialog`.
 *
 * Files that exceed the backend preview limit (HTTP 413) surface a clear
 * alert dialog telling the user they can open the file directly from its
 * path on their device.
 *
 * Usage:
 *   const { open, loadingPath, dialog } = useFilePreview();
 *   <button onClick={() => open(path)} />
 *   {dialog}
 */
export function useFilePreview(): FilePreviewState {
	const { t } = useTranslation("files");
	const [file, setFile] = useState<FileItem | null>(null);
	const [content, setContent] = useState<FileContent | null>(null);
	const [viewerOpen, setViewerOpen] = useState(false);
	const [loadingPath, setLoadingPath] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [tooLargePath, setTooLargePath] = useState<string | null>(null);

	const open = useCallback(async (path: string) => {
		setError(null);
		setLoadingPath(path);
		try {
			const result = await viewFile(path);
			setFile(fileItemFromPath(path));
			setContent(result);
			setViewerOpen(true);
		} catch (err) {
			if (err instanceof ApiError && err.status === 413) {
				setTooLargePath(path);
			} else {
				setError(
					err instanceof ApiError
						? err.message
						: err instanceof Error
							? err.message
							: "Couldn't load this file.",
				);
			}
		} finally {
			setLoadingPath(null);
		}
	}, []);

	const openInNewTab = useCallback(async (path: string) => {
		setError(null);
		setLoadingPath(path);
		// Open the tab synchronously (within the click) so it isn't blocked by
		// the popup blocker; we'll redirect it once the blob is ready.
		const tab = window.open("", "_blank");
		try {
			const result = await viewFile(path);
			const url = URL.createObjectURL(contentToBlob(result));
			if (tab) {
				tab.location.href = url;
			} else {
				window.open(url, "_blank", "noopener");
			}
			// Revoke after the tab has had time to load the blob.
			setTimeout(() => URL.revokeObjectURL(url), 60_000);
		} catch (err) {
			tab?.close();
			if (err instanceof ApiError && err.status === 413) {
				setTooLargePath(path);
			} else {
				setError(
					err instanceof ApiError
						? err.message
						: err instanceof Error
							? err.message
							: "Couldn't open this file.",
				);
			}
		} finally {
			setLoadingPath(null);
		}
	}, []);

	const dialog = (
		<>
			<FileViewerDialog
				open={viewerOpen}
				onOpenChange={setViewerOpen}
				file={file}
				content={content}
			/>

			<Dialog
				open={tooLargePath !== null}
				onOpenChange={(o) => (o ? null : setTooLargePath(null))}
			>
				<DialogContent className="max-w-[28rem]">
					<DialogHeader>
						<div className="flex items-center gap-3">
							<span className="grid size-10 place-items-center rounded-[var(--radius-md)] bg-warning/15 text-warning ring-1 ring-inset ring-warning/25 shrink-0">
								<HardDrive className="size-5" strokeWidth={1.7} />
							</span>
							<DialogTitle className="text-[1.0625rem]">
								{t("preview.tooLargeTitle")}
							</DialogTitle>
						</div>
						<DialogDescription className="pt-1">
							{t("preview.tooLargeDescription")}
						</DialogDescription>
					</DialogHeader>

					{tooLargePath ? (
						<div className="rounded-[var(--radius-md)] border border-border bg-surface-muted/50 px-3.5 py-2.5">
							<p className="text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
								{t("preview.details.path")}
							</p>
							<p
								dir="ltr"
								className="mt-1 font-mono text-[0.8125rem] text-foreground break-all"
							>
								{tooLargePath}
							</p>
						</div>
					) : null}

					<DialogFooter>
						<Button onClick={() => setTooLargePath(null)}>
							{t("preview.gotIt")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);

	return { open, openInNewTab, loadingPath, error, dialog };
}
