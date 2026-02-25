import { useParticipant } from "@videosdk.live/react-sdk";
import { useMemo } from "react";
import StreamAudio from "../components/StreamAudio";
import StreamVideo from "../components/StreamVideo";
import getFirstLastNameLetters from "../utils/getFirstLastNameLetters";
import getRandomColor from "../utils/getRandomColor";
import { AudioLines, Mic, MicOff, Video, VideoOff } from "lucide-react";

interface Props {
	view: "GRID" | "PRESENTER" | "LISTITEM" | "AVATAR";
	participantId: string;
}

export default function Participant({ participantId, view }: Props) {
	const {
		webcamStream,
		micStream,
		webcamOn,
		micOn,
		isLocal,
		displayName,
		isActiveSpeaker,
	} = useParticipant(participantId);

	const audioStream = useMemo(() => {
		if (micOn && micStream?.track) {
			const mediaStream = new MediaStream();
			mediaStream.addTrack(micStream.track);
			return mediaStream;
		}
		return null;
	}, [micOn, micStream?.track]);

	const videoStream = useMemo(() => {
		if (webcamOn && webcamStream?.track) {
			const mediaStream = new MediaStream();
			mediaStream.addTrack(webcamStream.track);
			return mediaStream;
		}
		return null;
	}, [webcamOn, webcamStream?.track]);

	const initials = useMemo(
		() => getFirstLastNameLetters(displayName),
		[displayName],
	);

	const bgColor = useMemo(() => getRandomColor(participantId), [participantId]);

	if (view === "GRID" || view === "PRESENTER") {
		return (
			<div
				className={`relative w-full overflow-hidden border shadow-lg ${
					isActiveSpeaker ? "border-[#698F07]" : "border-[#B1BBC7]"
				}
			${
				view === "GRID" ? "h-64 w-full"
				: view === "PRESENTER" ? "h-full w-full"
				: ""
			}
			`}>
				{audioStream && <StreamAudio stream={audioStream} muted={isLocal} />}

				{webcamOn && videoStream ?
					<StreamVideo stream={videoStream} />
				:	<div className='flex items-center justify-center w-full h-full'>
						<span
							className='text-3xl text-white rounded-full w-20 h-20 flex items-center justify-center'
							style={{
								backgroundColor: bgColor,
							}}>
							{initials}
						</span>
					</div>
				}

				<div className='absolute flex items-center justify-between gap-3 top-2 w-full px-2 py-1 '>
					<span className='bg-[#DCE8FE] px-2 py-1 rounded-lg text-xs text-[#798BA9]'>
						{isLocal ? "You" : displayName}
					</span>
					{micOn && isActiveSpeaker ?
						<AudioLines className='text-[#698F07] size-5' />
					: micOn && !isActiveSpeaker ?
						<Mic className='text-destructive  size-5' />
					:	<MicOff className='text-[#8695AA] size-5' />}
				</div>
			</div>
		);
	}

	if (view === "LISTITEM") {
		return (
			<div className='flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-[#E1EAFB] transition-colors'>
				<div className='flex items-center gap-2'>
					<span
						className='text-sm text-white rounded-full w-8 h-8 flex items-center justify-center'
						style={{
							backgroundColor: bgColor,
						}}>
						{initials}
					</span>
					<p className='text-sm text-[#162E54] font-bold'>
						{isLocal ? "You" : displayName}
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<div
						className={`p-2 w-8 h-8 rounded-full ${
							isActiveSpeaker ? "bg-[#f4f8e9]"
							: micOn ? "bg-[#DCE8FE]"
							: "bg-[#F9FAFB]"
						}`}>
						{micOn && isActiveSpeaker ?
							<AudioLines className='text-[#698F07] size-4' />
						: micOn && !isActiveSpeaker ?
							<Mic className='text-[#3B82F6]  size-4' />
						:	<MicOff className='text-[#8695AA] size-4' />}
					</div>

					<div
						className={`p-2 w-8 h-8 rounded-full ${
							webcamOn ? "bg-[#DCE8FE]" : "bg-[#F9FAFB]"
						}`}>
						{webcamOn ?
							<Video className='text-[#3B82F6] size-4' />
						:	<VideoOff className='text-[#8695AA] size-4' />}
					</div>
				</div>
			</div>
		);
	}

	if (view === "AVATAR") {
		return (
			<div
				className='relative flex shrink-0 items-center justify-center w-10 h-10 rounded-full shadow-sm'
				style={{
					backgroundColor: bgColor,
				}}>
				<span className='text-sm font-bold text-white tracking-wider'>
					{initials}
				</span>
			</div>
		);
	}

	return null;
}
