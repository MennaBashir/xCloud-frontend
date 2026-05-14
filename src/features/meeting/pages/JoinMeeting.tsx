import { useState } from "react";
import { images } from "../assets";
import JoinMeetingActions from "../components/JoinMeetingActions";

interface JoinViewProps {
	getMeetingAndToken: (meetingID?: string) => void;
}

const JoinMeetingPage = ({ getMeetingAndToken }: JoinViewProps) => {
	const [recentMeetings] = useState<
		{ id: string; name: string; date: string }[]
	>([]);

	if (recentMeetings && recentMeetings.length > 0)
		return (
			<div className='md:h-[calc(100vh-80px)] w-full p-6 bg-[#F9FAFB] grid grid-cols-1 md:grid-cols-2 gap-10 overflow-hidden'>
				{/* col-1 */}
				<div className='p-4 bg-[#EDEEF2] h-full w-full rounded-lg flex flex-col items-center justify-start gap-4'>
					<div className='w-full'>
						<img
							src={images.startMeeting}
							alt='start meeting'
							className='object-contain w-full max-h-75'
						/>
						<p className='text-[#162E54] font-bold text-center mt-2'>
							Start Your meeting, share ideas, and make collaboration
							effortless.
						</p>
					</div>
					<JoinMeetingActions getMeetingAndToken={getMeetingAndToken} />
				</div>

				{/* col-2 */}
				<div className='w-full flex flex-col min-h-0 h-full'>
					<h2 className='text-[#162E54] font-bold text-4xl mb-4 shrink-0'>
						Recent
					</h2>

					<div
						className='flex-1 overflow-y-auto pr-2 custom-scrollbar'
						style={{ maxHeight: "calc(100vh - 190px)" }}>
						<div className='flex flex-col gap-4 py-2'>
							{recentMeetings.map((meeting, index) => (
								<div
									key={`${meeting.id}-${index}`}
									className='p-5 bg-white shadow-lg border border-gray-100 rounded-2xl flex items-start justify-between gap-2 cursor-pointer hover:border-blue-300 transition-all'>
									<p className='text-[#5391F7] font-bold text-lg'>
										{meeting.name}
									</p>
									<div className='flex flex-col gap-1 text-right'>
										<span className='text-[#929EAE] text-[10px] font-bold uppercase'>
											Join date
										</span>
										<span className='text-[#324769] text-sm font-bold'>
											{meeting.date}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	else
		return (
			<div className='p-6 h-[calc(100vh-80px)] flex flex-col items-center text-center justify-center gap-6'>
				<img
					src={images.noRecentMeetings}
					alt='no recent meetings'
					className='object-contain max-h-100'
				/>
				<div>
					<p className='text-[#162E54] font-bold text-lg sm:text-2xl md:text-4xl'>
						Looks like ,There's no recent meeting found
					</p>
					<p className='text-[#64748B] font-bold text-sm sm:text-md md:text-lg mt-2 mb-10'>
						if you want to creat new one ,please click New meeting to get
						started
					</p>
				</div>
				<div className='mb-10'>
					<JoinMeetingActions getMeetingAndToken={getMeetingAndToken} />
				</div>
			</div>
		);
};

export default JoinMeetingPage;
