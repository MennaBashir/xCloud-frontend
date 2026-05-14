import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef } from "react";

interface PresenterViewProps {
	presenterId: string;
}

export default function PresenterView({ presenterId }: PresenterViewProps) {
	const { screenShareStream, screenShareOn, displayName, isLocal } =
		useParticipant(presenterId);

	const mediaStream = useMemo(() => {
		if (screenShareOn && screenShareStream?.track) {
			const stream = new MediaStream();
			stream.addTrack(screenShareStream.track);
			return stream;
		}
		return null;
	}, [screenShareOn, screenShareStream?.track]);

	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const videoElement = videoRef.current;
		if (videoElement && mediaStream) {
			videoElement.srcObject = mediaStream;
			const playPromise = videoElement.play();
			if (playPromise !== undefined) {
				playPromise.catch((error) =>
					console.error("ScreenShare play failed:", error),
				);
			}
		}
		return () => {
			if (videoElement) {
				videoElement.srcObject = null;
			}
		};
	}, [mediaStream]);

	if (!screenShareOn) return null;

	return (
		<div className='relative w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-lg flex flex-col'>
			<div className='absolute top-4 left-4 bg-black/70 backdrop-blur text-white px-3 py-1.5 rounded-lg z-10 text-sm flex items-center gap-2'>
				<span className='w-2 h-2 rounded-full bg-blue-500 animate-pulse'></span>
				{isLocal ? "You are presenting" : `${displayName} is presenting`}
			</div>

			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted
				className='w-full h-full object-contain'
			/>
		</div>
	);
}
