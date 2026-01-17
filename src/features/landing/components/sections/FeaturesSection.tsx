import { FeaturesCarousel } from "@/features/landing/components";

const FeaturesSection = () => {
	return (
		<div className='container mx-auto w-full overflow-hidden p-4 sm:p-8 xl:px-[92px] xl:py-16  flex flex-col items-center justify-center gap-4'>
			<h2 className='font-bold text-center text-xs xs:text-[16px] sm:text-[24px] md:text-[32px] text-primary-heading-text-color'>
				Discover What you can do in X-Cloud
			</h2>
			<FeaturesCarousel />
		</div>
	);
};

export default FeaturesSection;
