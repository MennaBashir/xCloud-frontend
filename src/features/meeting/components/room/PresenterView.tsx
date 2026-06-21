import { useEffect, useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";

import { cn } from "@/lib/utils";
import { ParticipantTile } from "./ParticipantTile";

type PresenterViewProps = {
	presenterId: string;
	otherIds: string[];
	/**
	 * The local participant id. When the local user is the one presenting we
	 * still render their own webcam tile in the strip so their camera/mic
	 * controls keep working and they get a self-preview — the screen-share
	 * surface only carries the shared screen, never their webcam.
	 */
	localId?: string | null;
};

/**
 * Layout for when someone is sharing their screen: large presenter
 * surface on the left, scrollable column of other participants on the
 * right. Collapses to a stack on small screens.
 *
 * Independence guarantee: the big surface renders ONLY the screen-share
 * track. Webcam + mic are rendered per-tile in the strip (including the
 * presenter's own tile), so toggling camera, mic, or recording never
 * interferes with screen sharing and vice-versa.
 */
export function PresenterView({
	presenterId,
	otherIds,
	localId,
}: PresenterViewProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const {
		displayName,
		screenShareStream,
		screenShareOn,
		micStream,
		micOn,
		isLocal,
	} = useParticipant(presenterId);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		if (screenShareOn && screenShareStream) {
			const ms = new MediaStream();
			ms.addTrack(screenShareStream.track);
			video.srcObject = ms;
			video.play().catch(() => {});
		} else {
			video.srcObject = null;
		}
	}, [screenShareStream, screenShareOn]);

	// Presenter's mic stream → audio element (skip local — would echo).
	// Without this, the presenter's tile (which played their mic) is
	// unmounted while presenting, so other members stop hearing them.
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

	return (
		<div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3 sm:gap-4">
			{/* Presenter */}
			<div
				className={cn(
					"flex-1 min-h-0 relative overflow-hidden",
					"rounded-[var(--radius-xl)] bg-zinc-900 ring-1 ring-inset ring-white/8",
				)}
			>
				<video
					ref={videoRef}
					autoPlay
					playsInline
					className="absolute inset-0 w-full h-full object-contain bg-black"
				/>
				{/* Presenter audio (remote only) */}
				{!isLocal ? <audio ref={audioRef} autoPlay /> : null}
				<div className="absolute bottom-3 start-3">
					<span className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-black/55 backdrop-blur-sm ring-1 ring-inset ring-white/10 text-[0.6875rem] font-medium text-white">
						<span
							aria-hidden="true"
							className="relative grid size-1.5 place-items-center"
						>
							<span className="absolute inset-0 rounded-full bg-success/70 animate-ping" />
							<span className="relative size-1.5 rounded-full bg-success" />
						</span>
						<span>{displayName} is sharing</span>
					</span>
				</div>
			</div>

			{/* Participant strip. When the LOCAL user is presenting we prepend
			    their own tile so their webcam preview + camera/mic controls
			    stay live independently of the screen share. */}
			<div className="flex lg:flex-col gap-2 sm:gap-3 lg:w-[200px] xl:w-[240px] shrink-0 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto">
				{localId && localId === presenterId ? (
					<div
						key={presenterId}
						className="w-[160px] sm:w-[180px] lg:w-full shrink-0"
					>
						<ParticipantTile participantId={presenterId} isPresenter />
					</div>
				) : null}
				{otherIds.map((id) => (
					<div key={id} className="w-[160px] sm:w-[180px] lg:w-full shrink-0">
						<ParticipantTile participantId={id} />
					</div>
				))}
			</div>
		</div>
	);
}
