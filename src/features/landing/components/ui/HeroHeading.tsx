const HeroHeading = () => {
	return (
		<div className='container mx-auto w-full flex-col text-secondary-text-color items-center justify-center gap-1 md:-mt-2.5 px-4 sm:px-8 xl:-mt-[35px]'>
			<h1 className='font-bold text-skyblue-50 text-sm text-center sm:text-[32px] xl:text-[40px] '>
				Welcome
				<span> User Name </span>
				TO X-Cloud
			</h1>
			<p className='font-bold text-xs text-center sm:text-[16px] xl:text-[20px] text-primary-heading-text-color'>
				Varified Services from SAAS Portal
			</p>
		</div>
	);
};

export default HeroHeading;
