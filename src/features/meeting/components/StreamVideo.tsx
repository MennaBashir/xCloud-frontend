import { useEffect, useRef } from "react";

interface StreamVideoProps {
	stream: MediaStream;
}

const StreamVideo = ({ stream }: StreamVideoProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const videoElement = videoRef.current;
		if (videoElement && stream) {
			videoElement.srcObject = stream;
			videoElement
				.play()
				.catch((error) =>
					console.error("videoElem.current.play() failed", error),
				);
		}
		return () => {
			if (videoElement) {
				videoElement.srcObject = null;
			}
		};
	}, [stream]);

	return (
		<video
			ref={videoRef}
			playsInline
			muted
			autoPlay
			className='w-full h-full object-cover transform scale-x-[-1]'
		/>
	);
};

export default StreamVideo;
