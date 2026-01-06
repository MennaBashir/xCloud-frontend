import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { images } from "@/features/landing/assets";

const LandingNavbar = () => {
	return (
		<nav className='container mx-auto w-full p-4 flex items-center justify-between'>
			<img
				className='size-10 md:size-16 xl:size-20'
				src={images.logo}
				alt='logo'
			/>
			<Avatar className='size-5 sm:size-6 md:size-8'>
				<AvatarImage />
				<AvatarFallback className='font-semibold text-primary-heading-text-color'>
					S
				</AvatarFallback>
			</Avatar>
		</nav>
	);
};

export default LandingNavbar;