import { images } from "@/features/landing/assets";

const LandingNavbar = () => {
	return (
		<nav className='container mx-auto w-full p-4 flex items-center justify-between'>
			<img
				className='size-15 xs:size-20 sm:size-[100px] md:size-[150px]'
				src={images.logo}
				alt='logo'
			/>
		</nav>
	);
};

export default LandingNavbar;
