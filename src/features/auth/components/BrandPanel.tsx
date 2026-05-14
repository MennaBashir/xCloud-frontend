import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
	CalendarDays,
	FolderClosed,
	Inbox,
	Sparkles,
	Video,
} from "lucide-react";

import { Logo } from "@/shared/components/Logo";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

/**
 * Right-side panel of the auth split layout.
 * Brand gradient mesh + tagline + animated feature pills marquee.
 *
 * Only renders on md+ (the layout hides this column on mobile).
 */
type BrandPanelProps = {
	className?: string;
};

const FEATURE_ICONS = [
	{ icon: Video, key: "nav.meeting" as const },
	{ icon: FolderClosed, key: "nav.files" as const },
	{ icon: Sparkles, key: "nav.chat" as const, accent: true as const },
	{ icon: CalendarDays, key: "nav.calendar" as const },
	{ icon: Inbox, key: "nav.gmail" as const },
];

export function BrandPanel({ className }: BrandPanelProps) {
	const { t } = useTranslation();
	const rootRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();

			mm.add(
				{
					default: "(prefers-reduced-motion: no-preference)",
					reduced: "(prefers-reduced-motion: reduce)",
				},
				(context) => {
					const reduced = !!context.conditions?.reduced;
					if (reduced) return;

					// Marquee of feature pills — duplicated row so the loop is seamless
					gsap.to(".brand-panel-marquee-track", {
						xPercent: -50,
						duration: 22,
						ease: "none",
						repeat: -1,
					});

					// Pillar of glowing dots subtle float
					gsap.to(".brand-panel-glow", {
						y: 18,
						duration: 4,
						yoyo: true,
						repeat: -1,
						ease: "sine.inOut",
					});
				},
			);

			return () => mm.revert();
		},
		{ scope: rootRef },
	);

	const pills = (
		<>
			{FEATURE_ICONS.map((p, i) => {
				const Icon = p.icon;
				return (
					<span
						key={`${p.key}-${i}`}
						className={cn(
							"inline-flex items-center gap-2 shrink-0",
							"px-3.5 h-9 rounded-full",
							"bg-white/8 backdrop-blur-md",
							"text-white/85 text-[0.8125rem] font-medium",
							"ring-1 ring-inset ring-white/12",
						)}
					>
						<Icon
							className={cn("size-3.5", p.accent && "text-white")}
							strokeWidth={1.6}
						/>
						<span className="tracking-tight">{t(p.key)}</span>
					</span>
				);
			})}
		</>
	);

	return (
		<aside
			ref={rootRef}
			className={cn(
				"relative isolate hidden md:flex md:col-span-2 lg:col-span-3 xl:col-span-3",
				"flex-col justify-between overflow-hidden",
				"bg-[oklch(0.18_0.06_280)] text-white",
				"px-10 py-12",
				className,
			)}
		>
			{/* Mesh gradient layer */}
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10"
				style={{
					background: `
						radial-gradient(at 16% 24%, oklch(0.65 0.2 285 / 0.55) 0px, transparent 50%),
						radial-gradient(at 82% 18%, oklch(0.62 0.19 245 / 0.45) 0px, transparent 50%),
						radial-gradient(at 60% 88%, oklch(0.55 0.2 285 / 0.4) 0px, transparent 55%),
						linear-gradient(160deg, oklch(0.18 0.06 280) 0%, oklch(0.12 0.04 280) 100%)
					`,
				}}
			/>

			{/* Glow blob (animated float) */}
			<div
				aria-hidden="true"
				className="brand-panel-glow pointer-events-none absolute -top-24 -right-24 size-[28rem] rounded-full opacity-50 blur-3xl"
				style={{
					background:
						"radial-gradient(circle at center, oklch(0.7 0.22 290 / 0.45), transparent 60%)",
				}}
			/>

			{/* Top — logo */}
			<div className="relative z-10">
				<Logo
					variant="full"
					className="text-white [&_span]:!text-white"
				/>
			</div>

			{/* Middle — tagline */}
			<div className="relative z-10 flex flex-col gap-5 max-w-md">
				<span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white/70">
					SprintifAI
				</span>
				<h2 className="font-semibold tracking-tight leading-[1.1] text-[2.25rem] xl:text-[2.75rem]">
					{t("panel.title", { ns: "auth" })}
				</h2>
				<p className="text-white/75 text-[1rem] leading-relaxed max-w-sm">
					{t("panel.subtitle", { ns: "auth" })}
				</p>
			</div>

			{/* Bottom — marquee of feature pills */}
			<div
				aria-hidden="true"
				className="relative z-10 -mx-10 overflow-hidden"
				style={{
					maskImage:
						"linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
				}}
			>
				<div className="brand-panel-marquee-track flex w-max items-center gap-3 px-10">
					{pills}
					{pills}
				</div>
			</div>
		</aside>
	);
}
