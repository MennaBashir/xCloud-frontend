import { useEffect, useMemo, useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
import { MicOff, Pin } from "lucide-react";

import { cn } from "@/lib/utils";

type ParticipantTileProps = {
	participantId: string;
	isSpeaker?: boolean;
	isPresenter?: boolean;
	className?: string;
};

function initials(name: string) {
	return name
		.trim()
		.split(/\s+/)
		.map((w) => w[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

export function ParticipantTile({
	participantId,
	isSpeaker,
	isPresenter,
	className,
}: ParticipantTileProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);

	const {
		displayName,
		webcamStream,
		micStream,
		webcamOn,
		micOn,
		isLocal,
	} = useParticipant(participantId);

	// Webcam stream → video element
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		if (webcamOn && webcamStream) {
			const ms = new MediaStream();
			ms.addTrack(webcamStream.track);
			video.srcObject = ms;
			video.play().catch(() => {});
		} else {
			video.srcObject = null;
		}
	}, [webcamStream, webcamOn]);

	// Mic stream → audio element (skip local — would echo)
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		if (!isLocal && micOn && micStream) {
			const ms = new MediaStream();
			ms.addTrack(micStream.track);
			audio.srcObject = ms;
			audio.play().catch(() => {});
		} else {
			audio.srcObject = null;
		}
	}, [micStream, micOn, isLocal]);

	const initialsLabel = useMemo(
		() => initials(displayName || "?"),
		[displayName],
	);

	return (
		<div
			className={cn(
				"relative aspect-video w-full overflow-hidden",
				"rounded-[var(--radius-xl)]",
				"bg-zinc-900",
				"ring-1 ring-inset",
				isSpeaker
					? "ring-success/60 shadow-[0_0_0_2px_oklch(0.65_0.16_162/0.4)]"
					: "ring-white/8",
				"transition-[box-shadow,transform] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
				className,
			)}
		>
			{/* Video */}
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted={isLocal}
				className={cn(
					"absolute inset-0 w-full h-full object-cover transition-opacity duration-[var(--duration-base)]",
					webcamOn && webcamStream ? "opacity-100" : "opacity-0",
				)}
				style={isLocal ? { transform: "scaleX(-1)" } : undefined}
			/>

			{/* Audio (remote only) */}
			{!isLocal ? <audio ref={audioRef} autoPlay /> : null}

			{/* Off overlay */}
			{(!webcamOn || !webcamStream) ? (
				<div className="absolute inset-0 grid place-items-center text-white">
					<div className="grid size-16 sm:size-20 place-items-center rounded-full bg-white/8 text-[1.125rem] sm:text-[1.5rem] font-semibold tracking-tight">
						{initialsLabel}
					</div>
				</div>
			) : null}

			{/* Bottom name chip */}
			<div className="absolute bottom-2 start-2 flex items-center gap-1.5">
				<span
					className={cn(
						"inline-flex items-center gap-1.5 h-6 px-2 rounded-full",
						"bg-black/55 backdrop-blur-sm ring-1 ring-inset ring-white/10",
						"text-[0.6875rem] font-medium text-white",
					)}
				>
					{!micOn ? (
						<MicOff className="size-2.5 text-destructive" strokeWidth={1.8} />
					) : null}
					<span className="truncate max-w-[10rem]">
						{displayName || "—"}
						{isLocal ? " (you)" : ""}
					</span>
				</span>
				{isPresenter ? (
					<span className="inline-flex items-center gap-1 h-6 px-2 rounded-full bg-white text-zinc-950 text-[0.625rem] font-semibold uppercase tracking-[0.14em]">
						<Pin className="size-2.5" strokeWidth={2.2} />
						<span>Sharing</span>
					</span>
				) : null}
			</div>
		</div>
	);
}
