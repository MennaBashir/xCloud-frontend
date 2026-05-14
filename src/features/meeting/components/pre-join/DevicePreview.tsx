import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MicOff, VideoOff } from "lucide-react";

import { cn } from "@/lib/utils";

type DevicePreviewProps = {
	stream: MediaStream | null;
	micOn: boolean;
	webcamOn: boolean;
	displayName: string;
	error: "permission" | "unsupported" | "unknown" | null;
};

function initials(name: string) {
	const trimmed = name.trim();
	if (!trimmed) return "?";
	return trimmed
		.split(/\s+/)
		.map((w) => w[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

export function DevicePreview({
	stream,
	micOn,
	webcamOn,
	displayName,
	error,
}: DevicePreviewProps) {
	const { t } = useTranslation("meeting");
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		if (stream && webcamOn) {
			if (video.srcObject !== stream) {
				video.srcObject = stream;
			}
			video.play().catch(() => {});
		} else {
			video.srcObject = null;
		}
	}, [stream, webcamOn]);

	return (
		<div
			className={cn(
				"relative aspect-video w-full overflow-hidden",
				"rounded-[var(--radius-2xl)] border border-white/8",
				"bg-zinc-950",
				"shadow-[0_1px_2px_oklch(0_0_0/0.06),0_32px_64px_-32px_oklch(0_0_0/0.5)]",
			)}
		>
			{/* Video element — always mounted to keep srcObject stable */}
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted
				className={cn(
					"absolute inset-0 w-full h-full object-cover",
					"transition-opacity duration-[var(--duration-base)] ease-[cubic-bezier(0.32,0.72,0,1)]",
					webcamOn && stream ? "opacity-100" : "opacity-0",
				)}
				style={{
					transform: "scaleX(-1)", // mirror the local preview
				}}
			/>

			{/* Off / no-stream overlay */}
			{(!webcamOn || !stream) && !error ? (
				<div className="absolute inset-0 grid place-items-center text-white">
					<div className="flex flex-col items-center gap-4">
						<div className="grid size-20 place-items-center rounded-full bg-white/8 text-white text-[1.5rem] font-semibold tracking-tight">
							{initials(displayName || "?")}
						</div>
						<p className="text-[0.875rem] text-white/65">
							{t("prejoin.cameraOff")}
						</p>
					</div>
				</div>
			) : null}

			{/* Permission denied overlay */}
			{error === "permission" ? (
				<div className="absolute inset-0 grid place-items-center px-6 text-center text-white">
					<div className="flex flex-col items-center gap-2 max-w-sm">
						<div className="grid size-12 place-items-center rounded-full bg-destructive/15 ring-1 ring-inset ring-destructive/30 text-destructive">
							<VideoOff className="size-5" strokeWidth={1.6} />
						</div>
						<p className="text-[0.9375rem] font-semibold">
							{t("prejoin.errors.permissionTitle")}
						</p>
						<p className="text-[0.8125rem] text-white/65 leading-relaxed">
							{t("prejoin.errors.permission")}
						</p>
					</div>
				</div>
			) : null}

			{error === "unsupported" ? (
				<div className="absolute inset-0 grid place-items-center px-6 text-center text-white">
					<p className="text-[0.875rem] text-white/65">
						{t("prejoin.errors.unsupported")}
					</p>
				</div>
			) : null}

			{/* Bottom-left mic chip */}
			<div className="absolute bottom-3 start-3 flex items-center gap-2">
				<span
					className={cn(
						"inline-flex items-center gap-1.5 h-7 px-2 rounded-full",
						"bg-black/45 backdrop-blur-md ring-1 ring-inset ring-white/12",
						"text-[0.6875rem] font-medium text-white",
					)}
				>
					{!micOn ? (
						<MicOff className="size-3 text-destructive" strokeWidth={1.8} />
					) : (
						<span
							aria-hidden="true"
							className="relative grid size-2 place-items-center"
						>
							<span className="absolute inset-0 rounded-full bg-success/70 animate-ping" />
							<span className="relative size-2 rounded-full bg-success" />
						</span>
					)}
					<span className="truncate max-w-[12rem]">
						{displayName || t("prejoin.namePlaceholder")}
					</span>
				</span>
			</div>
		</div>
	);
}
