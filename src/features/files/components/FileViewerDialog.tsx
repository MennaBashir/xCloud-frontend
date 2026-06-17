import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FileKindIcon } from "./FileKindIcon";
import { KIND_META, formatBytes } from "./file-meta";
import type { FileContent } from "../services/filesService";
import type { FileItem } from "../types/file";

type FileViewerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileItem | null;
  content: FileContent | null;
};

/** Pretty-print JSON when possible; otherwise return the raw text. */
function formatText(content: FileContent): string {
  const mime = content.mime_type ?? "";
  if (mime.includes("json") || content.name.toLowerCase().endsWith(".json")) {
    try {
      return JSON.stringify(JSON.parse(content.content), null, 2);
    } catch {
      return content.content;
    }
  }
  return content.content;
}

/**
 * Renders a file's content in an elegant, centered modal.
 *
 * Text files are presented as a paper-like document (A4-ish sheet, generous
 * margins, readable serif body) so transcripts and summaries feel like a
 * real page. Media renders inline with native controls.
 */
export function FileViewerDialog({
  open,
  onOpenChange,
  file,
  content,
}: FileViewerDialogProps) {
  const { t } = useTranslation("files");

  if (!file) return null;

  const size = formatBytes(file.sizeBytes);

  // Text + audio read better in a tighter dialog; video/binary keep the wider layout.
  const mime = content?.mime_type ?? "";
  const isTextContent = content?.is_text ?? false;
  const isAudioContent = !isTextContent && mime.startsWith("audio/");
  const isCompact = isTextContent || isAudioContent;
  const widthClass = isCompact
    ? "w-full max-w-[min(820px,calc(100vw-2rem))] sm:max-w-[min(820px,calc(100vw-2rem))]"
    : "w-full max-w-[min(820px,calc(100vw-2rem))] sm:max-w-[min(820px,calc(100vw-2rem))]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          widthClass,
          "p-0 gap-0 overflow-hidden",
          "bg-card border-border",
          "shadow-diffusion-lg",
        )}
      >
        {/* Header bar */}
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 text-start border-b border-border px-5 py-4 bg-surface-elevated/60">
          <FileKindIcon kind={file.kind} size="md" />
          <div className="min-w-0 flex-1">
            <DialogTitle className="truncate text-[1rem] font-semibold tracking-tight text-foreground">
              {file.name}
            </DialogTitle>
            <DialogDescription className="text-[0.75rem] text-muted-foreground">
              {t(KIND_META[file.kind].labelKey)} · {size.value} {size.unit}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Body */}
        <div
          className={cn(
            "bg-surface-muted/40 max-h-[80vh] overflow-y-auto scroll-smooth",
            isCompact
              ? "px-3 sm:px-5 py-4 sm:py-6"
              : "px-4 sm:px-8 py-6 sm:py-10",
          )}
        >
          {content ? <FileViewerBody content={content} t={t} /> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FileViewerBody({
  content,
  t,
}: {
  content: FileContent;
  t: (key: string) => string;
}) {
  const mime = content.mime_type ?? "";

  // Text → paper-style document sheet.
  if (content.is_text) {
    const text = formatText(content);
    const isCode =
      mime.includes("json") ||
      mime.includes("xml") ||
      mime.includes("yaml") ||
      content.name.toLowerCase().endsWith(".json");

    if (isCode) {
      return (
        <article
          className={cn(
            "mx-auto w-full max-w-[1000px]",
            "rounded-[var(--radius-lg)] border border-border bg-card",
            "shadow-[0_1px_2px_oklch(0_0_0/0.04),0_24px_48px_-24px_oklch(0_0_0/0.18)]",
            "overflow-hidden",
          )}
        >
          <pre
            className={cn(
              "overflow-x-auto",
              "px-6 sm:px-8 py-6 sm:py-7",
              "font-mono text-[0.8125rem] leading-[1.75] text-foreground",
              "[tab-size:2] selection:bg-ai/20",
            )}
          >
            <code>{text}</code>
          </pre>
        </article>
      );
    }

    // Prose → split into paragraphs for comfortable reading rhythm.
    const paragraphs = text.split(/\n{2,}/).map((p) => p.trim());

    return (
      <article
        className={cn(
          "mx-auto w-full max-w-[88ch]",
          "rounded-[var(--radius-lg)] border border-border bg-card",
          "shadow-[0_1px_2px_oklch(0_0_0/0.04),0_24px_48px_-24px_oklch(0_0_0/0.18)]",
          "px-5 sm:px-7 py-6 sm:py-8",
        )}
      >
        <div
          className={cn(
            "font-serif text-[1.0625rem] sm:text-[1.125rem]",
            "leading-[1.85] tracking-[0.003em]",
            "text-foreground/90",
            "[text-wrap:pretty] [hyphens:auto]",
            "selection:bg-ai/20",
          )}
        >
          {paragraphs.map((para, i) =>
            para.length === 0 ? null : (
              <p
                key={i}
                className="whitespace-pre-line break-words [&:not(:first-child)]:mt-[1.15em]"
              >
                {para}
              </p>
            ),
          )}
        </div>
      </article>
    );
  }

  const dataUrl =
    content.encoding === "base64"
      ? `data:${mime || "application/octet-stream"};base64,${content.content}`
      : null;

  if (dataUrl && mime.startsWith("image/")) {
    return (
      <img
        src={dataUrl}
        alt={content.name}
        className="mx-auto max-h-[70vh] w-auto rounded-[var(--radius-md)] border border-border bg-card"
      />
    );
  }

  if (dataUrl && mime.startsWith("audio/")) {
    return (
      <audio
        controls
        src={dataUrl}
        className="mx-auto block w-full max-w-[640px] border-0 outline-none [&::-webkit-media-controls-enclosure]:rounded-none [&::-webkit-media-controls-panel]:bg-transparent"
      >
        <track kind="captions" />
      </audio>
    );
  }

  if (dataUrl && mime.startsWith("video/")) {
    return (
      <video
        controls
        src={dataUrl}
        className="mx-auto block w-full max-w-[400px] border-0 outline-none [&::-webkit-media-controls-enclosure]:rounded-none [&::-webkit-media-controls-panel]:bg-transparent"
      >
        <track kind="captions" />
      </video>
    );
  }

  return (
    <div className="mx-auto max-w-[480px] rounded-[var(--radius-lg)] border border-border bg-card px-6 py-10 text-center text-[0.875rem] text-muted-foreground">
      {t("preview.binaryNotice")}
    </div>
  );
}
