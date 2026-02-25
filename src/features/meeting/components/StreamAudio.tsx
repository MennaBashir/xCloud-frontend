import { useEffect, useRef } from "react";

interface StreamAudioProps {
	stream: MediaStream;
	muted?: boolean;
}

const StreamAudio = ({ stream, muted }: StreamAudioProps) => {
	const micRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		const audioElement = micRef.current;
		if (audioElement && stream) {
			audioElement.srcObject = stream;
			audioElement
				.play()
				.catch((error) => console.error("audioElement.play() failed", error));
		}
		return () => {
			if (audioElement) {
				audioElement.srcObject = null;
			}
		};
	}, [stream]);

	return <audio ref={micRef} autoPlay playsInline muted={muted} />;
};

export default StreamAudio;
