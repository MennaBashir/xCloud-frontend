import Participant from "@/features/meeting/views/Participant";
import { useParticipant } from "@videosdk.live/react-sdk";
import type { Message } from "../types/message";

interface MessageProps {
	message: Message;
}

const MessageInfo = ({ message }: MessageProps) => {
	const { isLocal } = useParticipant(message.senderId);

	return (
		<div
			className={`flex w-full mb-4 ${
				isLocal ? "justify-end" : "justify-start"
			}`}>
			{!isLocal && (
				<div className='flex shrink-0 mr-3 mt-1'>
					<Participant participantId={message.senderId} view='AVATAR' />
				</div>
			)}

			<div
				className={`flex flex-col max-w-[75%] ${
					isLocal ? "items-end" : "items-start"
				}`}>
				{!isLocal && (
					<span className='text-[#162E54] text-sm font-bold mb-1 ml-1'>
						{message.senderName}
					</span>
				)}

				<div
					className={`px-4 py-2 text-sm rounded-2xl ${
						isLocal ?
							"bg-[#B2CBF6] text-[#162E54] rounded-br-sm"
						:	"bg-[#F4F7FB] text-[#475569] rounded-bl-sm"
					}`}
					style={{ wordBreak: "break-word" }}>
					{message.message}
				</div>

				<span className='text-[10px] text-slate-400 mt-1 mx-1'>
					{new Date(message.timestamp).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</span>
			</div>
		</div>
	);
};

export default MessageInfo;
