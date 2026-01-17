import { images } from "../../assets";
import { LandingNavbar, HeroHeading } from "@/features/landing/components";
const HeroSection = () => {
	return (
		<main
			className='w-full bg-cover min-h-45 xs:min-h-60 sm:min-h-[300px] md:min-h-[410px] lg:min-h-[430px] xl:min-h-[450px] 2xl:min-h-[470px] bg-no-repeat bg-bottom'
			style={{
				backgroundImage: `url(${images.homePageBackground})`,
			}}>
			<LandingNavbar />
			<HeroHeading />
		</main>
	);
};

export default HeroSection;
