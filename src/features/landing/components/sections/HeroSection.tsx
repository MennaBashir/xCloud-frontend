import { images } from "../../assets";
import { LandingNavbar, HeroHeading } from "@/features/landing/components";
const HeroSection = () => {
	return (
		<main
			className='w-full bg-cover min-h-[220px] md:min-h-[300px] xl:min-h-[350px] 2xl:min-h-[400px] bg-no-repeat bg-bottom'
			style={{
				backgroundImage: `url(${images.homePageBackgroung})`,
			}}>
			<LandingNavbar />
			<HeroHeading />
		</main>
	);
};

export default HeroSection;
