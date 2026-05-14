import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DoorOpen, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { images } from "../assets";
import { useMeetingLobby } from "../hooks/useMeetingLobby";
import StreamVideo from "../components/StreamVideo";

interface MeetingLobbyProps {
	meetingId: string;
	onClickJoin: (options: {
		micEnabled: boolean;
		webcamEnabled: boolean;
	}) => void;
}

export default function MeetingLobbyPage({
	meetingId,
	onClickJoin,
}: MeetingLobbyProps) {
	const {
		cameras,
		mics,
		selectedCamId,
		selectedMicId,
		isMicOn,
		isWebcamOn,
		customStream,
		handleToggleMic,
		handleToggleWebcam,
		handleDeviceChange,
		isRecording,
		isSummarizing,
		setIsRecording,
		setIsSummarizing,
	} = useMeetingLobby();

	return (
		<div className='p-6 flex h-[calc(100vh-80px)] w-full bg-white dark:bg-slate-950 overflow-hidden'>
			{/* Left Section */}
			<div className='hidden md:flex flex-col w-1/2 p-12 bg-gray-50 dark:bg-slate-900 rounded-lg'>
				<div className='max-w-md mx-auto'>
					<img
						src={images.startMeeting}
						alt='Meeting Illustration'
						className='w-full max-h-100 object-contain mb-8'
					/>
					<p className='-mt-10 text-2xl font-bold text-[#162E54] dark:text-white leading-tight'>
						Start your meeting, share ideas, and make collaboration effortless
						with SprintfAI.
					</p>
				</div>
			</div>

			{/* Right Section */}
			<div className='flex flex-col justify-center w-full md:w-1/2 p-8 md:p-0 md:pl-8 relative'>
				<h2 className='text-2xl text-[#162E54] font-bold mb-6 text-center md:text-left'>
					Room ID: <span>{meetingId}</span>
				</h2>

				{/* Preview Area */}
				<div className='relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-xl mb-6 group z-0'>
					{isWebcamOn ?
						<StreamVideo stream={customStream as MediaStream} />
					:	<div className='flex p-4 justify-center items-center bg-gray-800 h-full text-white/50'>
							Camera is Off
						</div>
					}

					<div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-50'>
						<Button
							variant={isMicOn ? "secondary" : "destructive"}
							size='icon'
							className='rounded-full w-12 h-12 shadow-lg cursor-pointer'
							onClick={handleToggleMic}>
							{isMicOn ?
								<Mic />
							:	<MicOff />}
						</Button>
						<Button
							variant={isWebcamOn ? "secondary" : "destructive"}
							size='icon'
							className='rounded-full w-12 h-12 shadow-lg cursor-pointer'
							onClick={handleToggleWebcam}>
							{isWebcamOn ?
								<Video />
							:	<VideoOff />}
						</Button>
					</div>
				</div>

				{/* Dropdowns */}
				<div className='flex flex-wrap gap-4 mb-6'>
					<div className='flex flex-row items-center justify-start gap-4 space-y-2'>
						<Label className='flex items-center gap-2'>
							<Mic className='w-4 h-4' /> Microphone
						</Label>
						<Select
							onValueChange={(id) => handleDeviceChange("mic", id)}
							value={selectedMicId}>
							<SelectTrigger>
								<SelectValue placeholder='Select Mic' />
							</SelectTrigger>
							<SelectContent>
								{mics
									.filter((mic) => mic.deviceId && mic.deviceId !== "")
									.map((mic) => (
										<SelectItem key={mic.deviceId} value={mic.deviceId}>
											{mic.label || `Mic ${mic.deviceId.slice(0, 5)}...`}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>

					<div className='flex flex-row items-center justify-start gap-4 space-y-2'>
						<Label className='flex items-center gap-2'>
							<Video className='w-4 h-4' /> Camera
						</Label>
						<Select
							onValueChange={(id) => handleDeviceChange("cam", id)}
							value={selectedCamId}>
							<SelectTrigger>
								<SelectValue placeholder='Select Camera' />
							</SelectTrigger>
							<SelectContent>
								{cameras
									.filter((cam) => cam.deviceId && cam.deviceId !== "")
									.map((cam) => (
										<SelectItem key={cam.deviceId} value={cam.deviceId}>
											{cam.label || `Camera ${cam.deviceId.slice(0, 5)}...`}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Checkboxes Area (Recording & Summarizing) */}
				<div className='space-y-4 mb-8'>
					<div
						className='flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 transition cursor-pointer'
						onClick={() => setIsRecording(!isRecording)}>
						<Checkbox
							className='data-[state=checked]:bg-[#3B82F6] data-[state=checked]:border-[#3B82F6]'
							id='record'
							checked={isRecording}
							onCheckedChange={(v) => setIsRecording(!!v)}
						/>
						<Label htmlFor='record' className='cursor-pointer font-medium'>
							Record meeting
						</Label>
					</div>

					<div
						className='flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 transition cursor-pointer'
						onClick={() => setIsSummarizing(!isSummarizing)}>
						<Checkbox
							className='data-[state=checked]:bg-[#3B82F6] data-[state=checked]:border-[#3B82F6]'
							id='ai'
							checked={isSummarizing}
							onCheckedChange={(v) => setIsSummarizing(!!v)}
						/>
						<Label htmlFor='ai' className='cursor-pointer font-medium'>
							Summarize meeting with AI
						</Label>
					</div>
				</div>

				{/* Join Button */}
				<Button
					className='flex items-center gap-2 w-full h-12 text-lg bg-[#3B82F6] hover:bg-[#2563EB] shadow-blue-200 shadow-xl transition-all'
					onClick={() => {
						if (customStream) {
							customStream.getTracks().forEach((t) => t.stop());
						}
						onClickJoin({
							micEnabled: isMicOn,
							webcamEnabled: isWebcamOn,
						});
					}}>
					<DoorOpen />
					<span>Join</span>
				</Button>
			</div>
		</div>
	);
}
