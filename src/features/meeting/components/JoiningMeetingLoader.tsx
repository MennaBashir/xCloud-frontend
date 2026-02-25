import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";

interface JoiningMeetingLoaderProps {
	isOpen: boolean;
}

export default function JoiningMeetingLoader({
	isOpen,
}: JoiningMeetingLoaderProps) {
	return (
		<Sheet defaultOpen={true} open={isOpen}>
			<SheetContent
				side='top'
				onInteractOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
				aria-label='Joining Meeting Loader'
				className='z-1000 flex h-screen w-screen items-center justify-center border-none bg-white p-0 overflow-hidden [&>button:not(.skip)]:hidden'>
				<SheetHeader className='hidden'>
					<SheetTitle>Joining Meeting</SheetTitle>
					<SheetDescription>
						Please wait while we connect you...
					</SheetDescription>
				</SheetHeader>

				<div className='flex items-center justify-center gap-4 p-8 rounded-2xl shadow-2xl'>
					<Spinner className='w-10 h-10 text-blue-600 animate-spin' />
					<p className='text-lg font-bold text-gray-800 animate-pulse'>
						Joining Meeting...
					</p>
				</div>
			</SheetContent>
		</Sheet>
	);
}
