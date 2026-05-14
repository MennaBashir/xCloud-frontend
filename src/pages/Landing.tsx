import {
	Features,
	FinalCta,
	Hero,
	LandingFooter,
	LandingNavbar,
	MotionBento,
} from "@/features/landing/components";

const LandingPage = () => {
	return (
		<div className="relative overflow-x-clip">
			<LandingNavbar />
			<main>
				<Hero />
				<MotionBento />
				<Features />
				<FinalCta />
			</main>
			<LandingFooter />
		</div>
	);
};

export default LandingPage;
