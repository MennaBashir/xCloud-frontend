import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Video, Keyboard } from "lucide-react";
import { useState } from "react";

interface JoinMeetingActionsProps {
	getMeetingAndToken: (meetingID?: string) => void;
}

export default function JoinMeetingActions({
	getMeetingAndToken,
}: JoinMeetingActionsProps) {
	const [meetingID, setMeetingID] = useState<string | undefined>(undefined);
	const handleJoinClick = () => getMeetingAndToken(meetingID);

	return (
		<div className='flex flex-row gap-6 items-center justify-center'>
			<Button
				className='bg-[#3B82F6] text-white px-3 py-6 hover:bg-[#2563EB] cursor-pointer flex items-center gap-2'
				onClick={handleJoinClick}>
				<Video />
				<span className='hidden md:block text-md'>New meeting</span>
			</Button>

			<div className='flex justify-between items-center gap-3'>
				<InputGroup className='bg-white rounded-md px-3 py-6'>
					<InputGroupInput
						placeholder='meeting ID'
						value={meetingID || ""}
						onChange={(e) => setMeetingID(e.target.value)}
					/>
					<InputGroupAddon>
						<Keyboard />
					</InputGroupAddon>
				</InputGroup>
				<Button
					variant={"ghost"}
					disabled={!meetingID}
					className={`text-[#3B82F6] font-bold text-md sm:text-lg ${!meetingID && "text-gray-400"}`}
					onClick={handleJoinClick}>
					Join
				</Button>
			</div>
		</div>
	);
}
