import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import useMediaQuery from "@/hooks/use-media-query";
import { ListCheck } from "lucide-react";
import * as React from "react";

interface ResponsiveModalProps {
	children: React.ReactNode;
}

export default function ResponsiveModal({ children }: ResponsiveModalProps) {
	const isDesktop = useMediaQuery("(min-width: 1200px)");

	if (isDesktop) {
		return children;
	}

	return (
		<Sheet>
			<SheetTrigger asChild>
				<ListCheck className='absolute top-[25px] right-4 h-9 w-9 lg:top-10 md:h-11 md:w-11 p-2 hover:bg-accent hover:cursor-pointer rounded-md' />
			</SheetTrigger>
			<SheetContent className='w-fit bg-transparent border-none'>
				<div className='sr-only'>
					<SheetHeader>
						<SheetTitle>Events</SheetTitle>
						<SheetDescription>Events List</SheetDescription>
					</SheetHeader>
				</div>
				{children}
			</SheetContent>
		</Sheet>
	);
}
