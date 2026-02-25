import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import JoiningMeetingLoader from "../components/JoiningMeetingLoader";
import Controls from "../components/Controls";
import Participant from "../views/Participant";
import PresenterView from "../views/Presenter";
import ChatArea from "../features/chat/components/ChatArea";

interface MeetingViewProps {
	meetingId: string;
	onMeetingLeave: () => void;
}

export default function MeetingPage({
	meetingId,
	onMeetingLeave,
}: MeetingViewProps) {
	const [joined, setJoined] = useState<"JOINED" | "JOINING">("JOINING");

	const { participants, localParticipant, presenterId } = useMeeting({
		onMeetingJoined: () => setJoined("JOINED"),
		onMeetingLeft: () => onMeetingLeave(),
	});

	const [remoteParticipants, setRemoteParticipants] = useState<string[]>([]);
	useEffect(() => {
		if (joined === "JOINED") {
			setRemoteParticipants(
				[...participants.keys()].filter((id) => id !== localParticipant?.id),
			);
		}
	}, [joined, participants, localParticipant]);

	const [isChatOpen, setIsChatOpen] = useState(true);
	const [isParticipantsOpen, setIsParticipantsOpen] = useState(true);

	const toggleChat = () => setIsChatOpen((prev) => !prev);
	const toggleParticipants = () => setIsParticipantsOpen((prev) => !prev);

	if (joined !== "JOINED") return <JoiningMeetingLoader isOpen={true} />;

	return (
		<div className='h-[calc(100vh-80px)] w-full flex flex-col bg-[#F3F4F6] overflow-hidden font-sans'>
			<div className='absolute top-8 right-[50%] translate-x-[50%] bg-black/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-white z-50 text-sm font-medium shadow-md'>
				Room ID: <span className='tracking-wider'>{meetingId}</span>
			</div>

			<div className='flex flex-1 w-full overflow-hidden p-4 gap-4'>
				<div className='transition-all duration-300 flex-1 flex flex-col gap-4 overflow-hidden'>
					{presenterId ?
						<>
							<div className='flex-3 w-full min-h-[50vh]'>
								<PresenterView presenterId={presenterId} />
							</div>

							<div className='flex-1 overflow-x-auto overflow-y-hidden bg-white rounded-2xl p-2 shadow-sm border border-slate-200'>
								<div className='flex gap-4 h-full min-w-max'>
									{localParticipant?.id && (
										<div className='w-64 h-full shrink-0'>
											<Participant
												view='PRESENTER'
												participantId={localParticipant.id}
											/>
										</div>
									)}
									{remoteParticipants.map((participantId) => (
										<div key={participantId} className='w-64 h-full shrink-0'>
											<Participant
												view='PRESENTER'
												participantId={participantId}
											/>
										</div>
									))}
								</div>
							</div>
						</>
					:	<div className='flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max'>
								{localParticipant?.id && (
									<Participant
										view='GRID'
										participantId={localParticipant.id}
									/>
								)}
								{remoteParticipants.map((participantId) => (
									<Participant
										key={participantId}
										view='GRID'
										participantId={participantId}
									/>
								))}
							</div>
						</div>
					}
				</div>

				{/* --- Sidebar (Chat & Participants) --- */}
				<div
					className={`transition-all duration-300 flex-col gap-4 w-80 min-w-[320px] ${isChatOpen || isParticipantsOpen ? "hidden lg:flex" : "hidden"}`}>
					{/* Participants list */}
					<div
						className={`flex-col bg-[#F9FAFB] rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 ${isParticipantsOpen ? "flex" : "hidden"} ${isChatOpen ? "h-1/2" : "h-full"}`}>
						<div className='bg-[#B2CBF6] p-3 text-[#162E54] font-bold flex justify-between items-center'>
							<span>Participantes</span>
							<span
								className='cursor-pointer'
								onClick={() => setIsParticipantsOpen(false)}>
								✖
							</span>
						</div>
						<div className='flex-1 p-4 overflow-y-auto'>
							<Participant
								view='LISTITEM'
								participantId={localParticipant.id}
							/>
							{remoteParticipants.map((participantId) => (
								<Participant
									key={participantId}
									view='LISTITEM'
									participantId={participantId}
								/>
							))}
						</div>
					</div>

					{/* Chat */}
					<div
						className={`flex flex-col bg-[#E1EAFB] rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 ${isChatOpen ? "flex" : "hidden"} ${isParticipantsOpen ? "h-1/2" : "h-full"}`}>
						<div className='bg-[#B2CBF6] p-3 text-[#162E54] font-bold flex justify-between items-center'>
							<span>Chat</span>
							<span
								className='cursor-pointer'
								onClick={() => setIsChatOpen(false)}>
								✖
							</span>
						</div>
						<div className='bg-[#F9FAFB] flex-1 p-3 overflow-hidden flex flex-col'>
							<ChatArea />
						</div>
					</div>
				</div>
			</div>

			{/* 3. Controls*/}
			<div className='h-auto w-full z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]'>
				<Controls
					isChatOpen={isChatOpen}
					isParticipantsOpen={isParticipantsOpen}
					toggleChat={toggleChat}
					toggleParticipants={toggleParticipants}
				/>
			</div>
		</div>
	);
}
