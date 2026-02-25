import { Button } from "@/components/ui/button";
import {
	Circle,
	Disc,
	LogOut,
	MessageCircleMore,
	Mic,
	Share,
	Users,
	Video,
} from "lucide-react";
import useMeetingControls from "../hooks/useMeetingControls";

interface ControlsProps {
	isChatOpen: boolean;
	isParticipantsOpen: boolean;
	toggleChat: () => void;
	toggleParticipants: () => void;
}

export default function Controls({
	isChatOpen,
	isParticipantsOpen,
	toggleChat,
	toggleParticipants,
}: ControlsProps) {
	const {
		micOn,
		webcamOn,
		isRecording,
		screenShareOn,
		handleMicClick,
		handleWebcamClick,
		handleScreenShareClick,
		handleRecordClick,
		handleLeaveClick,
	} = useMeetingControls();

	return (
		<div className='w-full relative bottom-0 bg-[#EEF5FF] flex items-center justify-between py-4 px-6'>
			<div className='flex items-center flex-col  gap-2'>
				<Button
					className='p-2 text-white cursor-pointer'
					size={"icon"}
					variant={"destructive"}
					onClick={handleRecordClick}>
					{isRecording ?
						<Circle className='animate-pulse' />
					:	<Disc />}
				</Button>
			</div>
			<div className='flex items-center gap-4'>
				<Button
					onClick={handleWebcamClick}
					size={"icon"}
					className={`cursor-pointer hover:bg-[#B2CBF6] rounded-full ${webcamOn ? "bg-[#DCE8FE] text-[#3B82F6]" : "bg-transparent text-[#8695AA]"}`}>
					<Video />
				</Button>
				<Button
					size={"icon"}
					onClick={handleMicClick}
					className={`cursor-pointer hover:bg-[#B2CBF6] rounded-full ${micOn ? "bg-[#DCE8FE] text-[#3B82F6]" : "bg-transparent text-[#8695AA]"}`}>
					<Mic />
				</Button>
				<Button
					size={"icon"}
					onClick={handleScreenShareClick}
					className={`cursor-pointer hover:bg-[#B2CBF6] rounded-full ${screenShareOn ? "bg-[#DCE8FE] text-[#3B82F6]" : "bg-transparent text-[#8695AA]"}`}>
					<Share />
				</Button>
				<Button
					onClick={toggleChat}
					className={`rounded-full hover:bg-[#B2CBF6] cursor-pointer  ${isChatOpen ? "bg-[#DCE8FE] text-[#3B82F6]" : "bg-transparent text-[#8695AA]"}`}>
					<MessageCircleMore />
				</Button>
				<Button
					onClick={toggleParticipants}
					className={`rounded-full hover:bg-[#B2CBF6] cursor-pointer  ${isParticipantsOpen ? "bg-[#DCE8FE] text-[#3B82F6]" : "bg-transparent text-[#8695AA]"}`}>
					<Users />
				</Button>
			</div>
			<Button
				className='p-2 text-white cursor-pointer'
				size={"icon"}
				variant={"destructive"}
				onClick={handleLeaveClick}>
				<LogOut />
			</Button>
		</div>
	);
}
