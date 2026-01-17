const HeroHeading = () => {
	return (
		<div className='container mx-auto w-full flex-col text-secondary-text-color items-center justify-center gap-1 -mt-3 xs:-mt-5 sm:-mt-6 px-4 sm:px-6 xl:-mt-10'>
			<h1 className='font-bold text-center text-skyblue-50 text-sm xs:text-[24px] sm:text-[32px] md:text-[45px] xl:text-[62px] '>
				Welcome
				<span> User Name </span>
				TO X-Cloud
			</h1>
			<p className='font-bold text-center text-xs xs:text-[16px] sm:text-[24px] md:text-[32px] text-primary-heading-text-color'>
				Varified Services from SAAS Portal
			</p>
		</div>
	);
};

export default HeroHeading;
