import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import { usePubSub } from "@videosdk.live/react-sdk";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [isSendingMessage, setIsSendingMessage] = useState(false);

	const { publish } = usePubSub("CHAT");

	const handleSendMessage = () => {
		if (message.trim() === "") return;
		setIsSendingMessage(true);
		publish(message, { persist: true })
			.then(() => {
				console.log("Message sent successfully");
			})
			.catch((e) => {
				console.log("Error while sending message through pubsub", e);
			})
			.finally(() => {
				setMessage("");
				setIsSendingMessage(false);
			});
	};

	return (
		<div className='w-full mt-auto pt-2 bg-transparent'>
			<InputGroup className='bg-gray-100 rounded-full border border-slate-200 overflow-hidden shadow-sm'>
				<InputGroupInput
					name='message'
					placeholder='Type your message here...'
					className='pl-4 border-none focus-visible:ring-0 shadow-none'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleSendMessage();
					}}
				/>
				<InputGroupAddon
					align={"inline-end"}
					className='bg-transparent border-none'>
					<Button
						onClick={handleSendMessage}
						className='p-2 cursor-pointer text-[#3B82F6] hover:bg-blue-50 rounded-full mr-1'
						size={"icon"}
						variant='ghost'
						disabled={!message.trim()}>
						{isSendingMessage ?
							<Spinner className='w-5 h-5' />
						:	<SendHorizontal className='w-5 h-5' />}
					</Button>
				</InputGroupAddon>
			</InputGroup>
		</div>
	);
};

export default MessageInput;
