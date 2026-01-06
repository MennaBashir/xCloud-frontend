import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";
import { BellRing } from "lucide-react";

interface DeleteEventDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

const DeleteEventDialog = ({
	open,
	onOpenChange,
	onConfirm,
}: DeleteEventDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-[220px] sm:w-[400px]'>
				<DialogHeader>
					<DialogTitle className='text-[#F61212] text-center font-bold text-xl flex gap-4 items-center mt-4'>
						<BellRing className='w-6 h-6 text-[#FBBF24]' />
						Delete Event
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className='text-center sm:text-start text-skyblue-950 text-sm font-medium mt-2'>
					Are you sure you want to delete this event?
				</DialogDescription>
				<DialogFooter className='gap-4'>
					<Button
						className='bg-[#F61212] hover:bg-[#F61212] cursor-pointer text-[#ffd0d0] hover:text-white px-5 py-[25px] rounded-xl font-semibold text-lg shadow-md transition-colors'
						onClick={() => {
							onOpenChange(false);
							onConfirm();
						}}>
						Delete
					</Button>
					<Button
						className='bg-[#e3e3e4] hover:bg-[#e3e3e4] cursor-pointer text-[#64748B] hover:text-[#2b3036] px-5 py-[25px] rounded-xl font-semibold text-lg shadow-md transition-colors'
						onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteEventDialog;
