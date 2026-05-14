import { cn } from "@/lib/utils";

type LogoVariant = "icon" | "full" | "mark";

type LogoProps = {
	variant?: LogoVariant;
	className?: string;
	"aria-label"?: string;
	/**
	 * Use a monochrome fill instead of the brand gradient.
	 * Useful when the logo sits inside another colored surface (e.g. the
	 * auth brand panel where the whole UI is already gradient).
	 */
	monochrome?: boolean;
};

/**
 * SprintifAI brand mark.
 *
 * The mark is a stack of three angled bars converging forward into a single
 * point — a visual metaphor for the product's promise: multiple meetings
 * resolving into a single decision/outcome. A small accent dot at the
 * convergence point hints at AI without falling into the "purple sparkle"
 * cliché.
 *
 * Variants:
 *  - `icon`: 32×32 filled rounded-square — sidebar / favicon / app icon
 *  - `mark`: the glyph alone (no background container) — use inside
 *    colored surfaces or contexts that need the silhouette only
 *  - `full`: mark + wordmark; the "AI" suffix uses the brand gradient as
 *    a deliberate accent moment
 */
export function Logo({
	variant = "full",
	className,
	"aria-label": ariaLabel = "SprintifAI",
	monochrome = false,
}: LogoProps) {
	if (variant === "mark") {
		return (
			<svg
				viewBox="0 0 32 32"
				role="img"
				aria-label={ariaLabel}
				className={cn("size-8 shrink-0", className)}
			>
				<MarkGlyph fill="currentColor" />
			</svg>
		);
	}

	if (variant === "icon") {
		return (
			<svg
				viewBox="0 0 32 32"
				role="img"
				aria-label={ariaLabel}
				className={cn("size-8 shrink-0", className)}
			>
				<defs>
					<linearGradient
						id="sprintifai-icon-bg"
						x1="2"
						y1="2"
						x2="30"
						y2="30"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="oklch(0.55 0.2 285)" />
						<stop offset="100%" stopColor="oklch(0.62 0.19 245)" />
					</linearGradient>
					{/* Inner highlight — gives the tile a slight hardware feel */}
					<linearGradient
						id="sprintifai-icon-sheen"
						x1="0"
						y1="0"
						x2="0"
						y2="32"
						gradientUnits="userSpaceOnUse"
					>
						<stop
							offset="0%"
							stopColor="#FFFFFF"
							stopOpacity="0.16"
						/>
						<stop
							offset="60%"
							stopColor="#FFFFFF"
							stopOpacity="0"
						/>
					</linearGradient>
				</defs>

				{monochrome ? (
					<rect
						x="0"
						y="0"
						width="32"
						height="32"
						rx="8"
						fill="currentColor"
					/>
				) : (
					<>
						<rect
							x="0"
							y="0"
							width="32"
							height="32"
							rx="8"
							fill="url(#sprintifai-icon-bg)"
						/>
						<rect
							x="0"
							y="0"
							width="32"
							height="32"
							rx="8"
							fill="url(#sprintifai-icon-sheen)"
						/>
					</>
				)}

				<MarkGlyph fill="#FFFFFF" />
			</svg>
		);
	}

	// full: mark + wordmark
	return (
		<span
			role="img"
			aria-label={ariaLabel}
			className={cn("inline-flex items-center gap-2.5", className)}
		>
			<svg
				viewBox="0 0 32 32"
				aria-hidden="true"
				className="size-7 shrink-0"
			>
				<defs>
					<linearGradient
						id="sprintifai-full-bg"
						x1="2"
						y1="2"
						x2="30"
						y2="30"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="oklch(0.55 0.2 285)" />
						<stop offset="100%" stopColor="oklch(0.62 0.19 245)" />
					</linearGradient>
					<linearGradient
						id="sprintifai-full-sheen"
						x1="0"
						y1="0"
						x2="0"
						y2="32"
						gradientUnits="userSpaceOnUse"
					>
						<stop
							offset="0%"
							stopColor="#FFFFFF"
							stopOpacity="0.16"
						/>
						<stop
							offset="60%"
							stopColor="#FFFFFF"
							stopOpacity="0"
						/>
					</linearGradient>
				</defs>
				<rect
					x="0"
					y="0"
					width="32"
					height="32"
					rx="8"
					fill="url(#sprintifai-full-bg)"
				/>
				<rect
					x="0"
					y="0"
					width="32"
					height="32"
					rx="8"
					fill="url(#sprintifai-full-sheen)"
				/>
				<MarkGlyph fill="#FFFFFF" />
			</svg>

			<span className="font-semibold tracking-[-0.02em] text-foreground text-[0.9375rem]">
				Sprintif
				<span className="text-brand-gradient font-semibold">AI</span>
			</span>
		</span>
	);
}

/**
 * The mark glyph itself — three converging chevrons + accent dot.
 *
 * Built on a 32-unit grid so every coordinate is integer-aligned;
 * this keeps the mark crisp at favicon sizes (16×16 and 24×24).
 */
function MarkGlyph({ fill = "#FFFFFF" }: { fill?: string }) {
	return (
		<g fill={fill}>
			{/* Top chevron — farthest back, narrowest */}
			<path
				d="M11 9 L14.5 9 L19 16 L17.25 19 L11 9 Z"
				opacity="0.55"
			/>
			{/* Middle chevron — mid-depth */}
			<path
				d="M8.5 14 L12 14 L17 22 L13.5 22 L8.5 14 Z"
				opacity="0.78"
			/>
			{/* Bottom / front chevron — full strength */}
			<path d="M6 19 L9.5 19 L14.5 27 L11 27 L6 19 Z" />

			{/* Forward-moving point bar — anchors the convergence */}
			<rect
				x="17"
				y="14"
				width="6.5"
				height="2.4"
				rx="1.2"
				transform="rotate(28 17 14)"
			/>

			{/* AI accent dot — small, deliberate, top-right */}
			<circle cx="24.5" cy="9.5" r="1.6" />
		</g>
	);
}
