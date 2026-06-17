import type { JSX } from "react";

import { cn } from "@/lib/utils";
import type { ModelFamily } from "../types/chat";

type ModelLogoProps = {
	family: ModelFamily;
	className?: string;
};

/**
 * Per-family model logo shown beside each model name in the picker.
 *
 * These are the real, recognizable official brand marks for each model
 * family, rendered as inline SVG (the repo's convention for crisp, themeable
 * marks — see `shared/components/Logo.tsx`). `currentColor` is used where the
 * official mark is monochrome so it adapts to light/dark themes; brand colors
 * are kept where they are part of the identity.
 */

// Qwen (Alibaba) — stylised "q" lockup.
function QwenMark() {
	return (
		<svg viewBox="0 0 24 24" className="size-full" fill="#615CED">
			<path d="M12.6 2.4a1.2 1.2 0 0 1 1.04.6l2.5 4.33h4.92a1.2 1.2 0 0 1 1.04 1.8l-2.46 4.27 2.46 4.27a1.2 1.2 0 0 1-1.04 1.8h-4.99l-2.46 4.26a1.2 1.2 0 0 1-2.08 0l-2.5-4.33H4.12a1.2 1.2 0 0 1-1.04-1.8l2.46-4.27-2.42-4.2a1.2 1.2 0 0 1 1.04-1.8h4.99l2.46-4.27a1.2 1.2 0 0 1 1.03-.63Zm.02 3.6-1.46 2.53h2.92L12.62 6Zm-3.54 3.93H6.16l1.46 2.53 1.46-2.53Zm9 0h-2.92l1.46 2.53 1.46-2.53ZM9.7 13.07l1.46 2.53h1.69l1.46-2.53H9.7Zm-1.62.4-1.46 2.53h2.92L8.08 13.47Zm7.84 0-1.46 2.53h2.92l-1.46-2.53Zm-3.3 4.13L12.62 18l-.62 1.07h1.24Z" />
		</svg>
	);
}

// Meta / Llama — Meta infinity mark.
function MetaMark() {
	return (
		<svg viewBox="0 0 24 24" className="size-full" fill="#0866FF">
			<path d="M6.9 5.4c1.86 0 3.3 1.4 4.62 3.45.9-1.3 1.86-2.18 2.97-2.78a4.7 4.7 0 0 1 2.27-.62c2.4 0 4.34 2.18 4.34 6.02 0 3.1-1.4 4.93-3.62 4.93-1.62 0-2.83-.92-4.27-3.2l-.9-1.5-.04.06c-1.27 2.1-2.27 3.3-3.43 3.97a3.9 3.9 0 0 1-1.98.5c-2.06 0-3.43-1.7-3.43-4.45 0-3.66 1.86-6.85 4.9-6.85Zm.36 2.16c-1.5 0-2.74 2.14-2.74 4.6 0 1.32.5 2.06 1.38 2.06.7 0 1.24-.36 2.27-1.96.32-.5.7-1.12 1.16-1.9l-.36-.6C7.97 8.4 7.6 7.56 7.26 7.56Zm9.5 0c-.66 0-1.26.38-1.86 1.06-.5.56-.98 1.32-1.5 2.2l.6 1c1.06 1.74 1.62 2.2 2.46 2.2.92 0 1.46-.8 1.46-2.3 0-2.62-.86-4.16-1.16-4.16Z" />
		</svg>
	);
}

// Google / Gemma — Google "G".
function GoogleMark() {
	return (
		<svg viewBox="0 0 24 24" className="size-full">
			<path
				fill="#4285F4"
				d="M22.5 12.2c0-.7-.06-1.4-.18-2.06H12v3.9h5.9a5.05 5.05 0 0 1-2.19 3.32v2.74h3.54c2.07-1.9 3.25-4.71 3.25-7.9Z"
			/>
			<path
				fill="#34A853"
				d="M12 23c2.95 0 5.43-.98 7.24-2.65l-3.54-2.74c-.98.66-2.24 1.05-3.7 1.05-2.85 0-5.26-1.92-6.12-4.5H2.23v2.83A11 11 0 0 0 12 23Z"
			/>
			<path
				fill="#FBBC05"
				d="M5.88 14.16a6.6 6.6 0 0 1 0-4.32V7.01H2.23a11 11 0 0 0 0 9.98l3.65-2.83Z"
			/>
			<path
				fill="#EA4335"
				d="M12 5.34c1.6 0 3.05.55 4.18 1.63l3.14-3.14A11 11 0 0 0 2.23 7.01l3.65 2.83C6.74 7.26 9.15 5.34 12 5.34Z"
			/>
		</svg>
	);
}

// Mistral AI — stacked tricolour bars.
function MistralMark() {
	return (
		<svg viewBox="0 0 24 24" className="size-full">
			<rect x="3" y="4" width="3.6" height="3.6" fill="#000" />
			<rect x="17.4" y="4" width="3.6" height="3.6" fill="#000" />
			<rect x="3" y="7.6" width="3.6" height="3.6" fill="#F7D046" />
			<rect x="6.6" y="7.6" width="3.6" height="3.6" fill="#F7D046" />
			<rect x="13.8" y="7.6" width="3.6" height="3.6" fill="#F7D046" />
			<rect x="17.4" y="7.6" width="3.6" height="3.6" fill="#F7D046" />
			<rect x="3" y="11.2" width="3.6" height="3.6" fill="#F2A73B" />
			<rect x="6.6" y="11.2" width="3.6" height="3.6" fill="#F2A73B" />
			<rect x="10.2" y="11.2" width="3.6" height="3.6" fill="#F2A73B" />
			<rect x="13.8" y="11.2" width="3.6" height="3.6" fill="#F2A73B" />
			<rect x="17.4" y="11.2" width="3.6" height="3.6" fill="#F2A73B" />
			<rect x="3" y="14.8" width="3.6" height="3.6" fill="#EE792F" />
			<rect x="10.2" y="14.8" width="3.6" height="3.6" fill="#EE792F" />
			<rect x="17.4" y="14.8" width="3.6" height="3.6" fill="#EE792F" />
			<rect x="3" y="18.4" width="3.6" height="3.6" fill="#EB5829" />
			<rect x="17.4" y="18.4" width="3.6" height="3.6" fill="#EB5829" />
		</svg>
	);
}

// Microsoft / Phi — Microsoft four-square.
function MicrosoftMark() {
	return (
		<svg viewBox="0 0 24 24" className="size-full">
			<rect x="3" y="3" width="8.5" height="8.5" fill="#F25022" />
			<rect x="12.5" y="3" width="8.5" height="8.5" fill="#7FBA00" />
			<rect x="3" y="12.5" width="8.5" height="8.5" fill="#00A4EF" />
			<rect x="12.5" y="12.5" width="8.5" height="8.5" fill="#FFB900" />
		</svg>
	);
}

// DeepSeek — whale mark (simplified official silhouette).
function DeepSeekMark() {
	return (
		<svg viewBox="0 0 24 24" className="size-full" fill="#4D6BFE">
			<path d="M21.4 5.1c-.3-.15-.5.1-.74.28-.08.06-.16.14-.22.22-.55.6-1.2.98-2.06.93-1.25-.07-2.32.32-3.26 1.28-.2-1.18-.86-1.88-1.87-2.33-.53-.23-1.07-.46-1.44-.97-.26-.37-.33-.78-.46-1.18-.08-.24-.16-.49-.44-.53-.3-.05-.42.2-.54.42-.48.88-.66 1.85-.64 2.83.04 2.2.97 3.96 2.82 5.21.21.14.26.29.2.5-.13.42-.27.84-.4 1.27-.09.27-.21.33-.5.21a5.6 5.6 0 0 1-1.8-1.32c-.95-1-1.8-2.1-2.88-2.97a13 13 0 0 0-.78-.58c-1.12-1.08.15-1.97.44-2.08.31-.11.1-.5-.9-.49-1 0-1.91.34-3.08.79-.17.07-.35.12-.53.17v-.02c-.85-.21-1.73-.26-2.62-.16-1.67.18-3 .97-3.98 2.32-1.17 1.62-1.45 3.46-1.1 5.38.36 2.02 1.4 3.7 3 5.02a8 8 0 0 0 5.65 1.86c1.13-.05 2.4-.2 3.82-1.4.36.18.74.25 1.36.3.49.05.95-.02 1.31-.1.56-.13.52-.65.32-.74-1.65-.77-1.29-.46-1.62-.7 0 0 .94-1.12 1.27-1.7l.04-.06c.05-.08.1-.15.14-.23.34-.62.07-1.27-.35-1.78-.27-.32-.7-.5-1.16-.7-.55-.24-.83-.6-.94-1.18-.06-.32.05-.7.27-.99.51-.66 1.26-.9 2.03-.84 1.13.08 1.7.93 2.42 1.32.4.22.83.4 1.28.5.05.02.1.04.16.05.04.13.04.27.04.4 0 .05 0 .1.02.15-.04.07-.1.12-.17.16-.16.1-.27.27-.35.5-.06.18-.04.36.07.5.11.13.27.18.43.16.1-.01.2-.03.3-.05a.97.97 0 0 0 .55-.39c.06-.1.06-.23.02-.34a.6.6 0 0 0-.06-.13c-.04-.07-.04-.13.05-.17.16-.08.32-.16.46-.27.5-.38.86-.86 1.07-1.45.06-.18.08-.37.1-.56.04-.4-.1-.74-.4-.9Zm-9.04 11.07c-.06.18-.27.4-.5.5-.21.1-.4.07-.55-.1-.16-.18-.13-.38.02-.55.16-.18.32-.32.42-.5.18-.32.2-.66.3-1 .12-.4.32-.74.7-.97.4.55.51 1.16.5 1.83-.1.26-.3.51-.9.79Z" />
		</svg>
	);
}

// Nomic (embeddings) — geometric diamond cluster.
function NomicMark() {
	return (
		<svg viewBox="0 0 24 24" className="size-full" fill="#10B981">
			<path d="M12 2.5 21.5 12 12 21.5 2.5 12 12 2.5Zm0 4.2L6.7 12 12 17.3 17.3 12 12 6.7Zm0 3.1L14.2 12 12 14.2 9.8 12 12 9.8Z" />
		</svg>
	);
}

// Cohere / Command — coral concentric mark.
function CohereMark() {
	return (
		<svg viewBox="0 0 24 24" className="size-full" fill="#39594D">
			<path d="M8.4 14.5c.65 0 1.95-.04 3.74-.78 2.08-.86 6.23-2.42 9.22-4.02 2.1-1.12 3.02-2.6 3.02-4.6A4.6 4.6 0 0 0 19.8 0H7.9A7.9 7.9 0 0 0 0 7.9c0 4.36 3.43 6.6 8.4 6.6Z" transform="translate(-.2 4.5) scale(.92)" />
			<path d="M9.9 18.7a4.8 4.8 0 0 1 .9-2.85l.96-1.27a3.5 3.5 0 0 1 2.78-1.4h.06a3.46 3.46 0 0 1 3.46 3.46v1.46a3.45 3.45 0 0 1-3.46 3.46 4.7 4.7 0 0 1-4.7-2.32Z" transform="translate(-.2 0) scale(.85)" fill="#E03C32" />
			<circle cx="4.6" cy="17.6" r="3.6" fill="#FF7759" />
		</svg>
	);
}

const FAMILY: Record<ModelFamily, () => JSX.Element> = {
	qwen: QwenMark,
	llama: MetaMark,
	gemma: GoogleMark,
	mistral: MistralMark,
	phi: MicrosoftMark,
	deepseek: DeepSeekMark,
	nomic: NomicMark,
	command: CohereMark,
	generic: NomicMark,
};

export function ModelLogo({ family, className }: ModelLogoProps) {
	const Mark = FAMILY[family] ?? FAMILY.generic;
	return (
		<span
			aria-hidden="true"
			className={cn(
				"grid size-5 shrink-0 place-items-center overflow-hidden",
				"rounded-[6px] bg-white p-0.5 ring-1 ring-inset ring-black/10",
				className,
			)}
		>
			<Mark />
		</span>
	);
}
