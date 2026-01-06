import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const LandingFooter = () => {
	const isMobile = useIsMobile();
	return (
		<div className='w-full container mx-auto flex justify-end p-4'>
			{isMobile ? (
				<Button
					size={"icon"}
					className='bg-skyblue-500 text-white hover:bg-skyblue-600 cursor-pointer'>
					<ArrowRight className='size-4 text-white' />
				</Button>
			) : (
				<Button className='ml-auto bg-skyblue-600 text-white hover:bg-skyblue-700 cursor-pointer'>
					<ArrowRight className='size-4 text-white' />
					Continue To Workspace
				</Button>
			)}
		</div>
	);
};

export default LandingFooter;