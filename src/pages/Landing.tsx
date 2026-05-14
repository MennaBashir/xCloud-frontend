import {
	Features,
	FinalCta,
	Hero,
	HowItWorks,
	LandingFooter,
	LandingNavbar,
	LogosStrip,
	Testimonial,
} from "@/features/landing/components";

const LandingPage = () => {
	return (
		<div className="relative overflow-x-clip">
			<LandingNavbar />
			<main>
				<Hero />
				<LogosStrip />
				<Features />
				<HowItWorks />
				<Testimonial />
				<FinalCta />
			</main>
			<LandingFooter />
		</div>
	);
};

export default LandingPage;
