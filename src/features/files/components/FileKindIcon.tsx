import { cn } from "@/lib/utils";

import { KIND_META, toneClasses } from "./file-meta";
import type { FileKind } from "../types/file";

type FileKindIconProps = {
	kind: FileKind;
	className?: string;
	/** Disc size — small (24), default (40), large (56). */
	size?: "sm" | "md" | "lg";
};

export function FileKindIcon({
	kind,
	className,
	size = "md",
}: FileKindIconProps) {
	const meta = KIND_META[kind];
	const Icon = meta.icon;

	return (
		<span
			className={cn(
				"inline-grid place-items-center rounded-[var(--radius-md)] ring-1 ring-inset shrink-0",
				toneClasses(meta.tone),
				size === "sm" && "size-7",
				size === "md" && "size-10",
				size === "lg" && "size-14",
				className,
			)}
		>
			<Icon
				className={cn(
					size === "sm" && "size-3.5",
					size === "md" && "size-[1.125rem]",
					size === "lg" && "size-6",
				)}
				strokeWidth={1.6}
			/>
		</span>
	);
}
