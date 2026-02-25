import { usePubSub } from "@videosdk.live/react-sdk";
import MessageInput from "./MessageInput";
import MessageInfo from "./Message";

const ChatArea = () => {
	const { messages } = usePubSub("CHAT");

	return (
		<div className='flex flex-col w-full h-full relative'>
			<div className='flex-1 overflow-y-auto flex flex-col gap-2 pr-2 pb-2'>
				{messages.length === 0 ?
					<p className='text-center text-slate-400 text-sm mt-10'>
						No messages yet. Start chatting!
					</p>
				:	messages.map((msg, index) => <MessageInfo key={index} message={msg} />)
				}
			</div>
			<MessageInput />
		</div>
	);
};

export default ChatArea;
