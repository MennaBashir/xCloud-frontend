import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { carouselItemsData } from "../../data/carouselItems";
import { FeatureCard } from "@/features/landing/components";
const FeaturesCarousel = () => {
	return (
		<Carousel className='w-full max-w-[200px] xs:max-w-[300px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[900px] xl:max-w-[1300px] 2xl:max-w-[1500px] mx-auto relative'>
			<CarouselContent className='-ml-4 sm:-ml-4'>
				{carouselItemsData.map((item) => (
					<CarouselItem
						className='pl-0.5 sm:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4'
						key={item.title}>
						<FeatureCard item={item} />
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className='size-0 xs:size-10 bg-skyblue-500 text-white hover:bg-skyblue-600 hover:text-white hover:scale-[1.2] cursor-pointer disabled:opacity-0' />
			<CarouselNext className='size-0 xs:size-10 bg-skyblue-500 text-white hover:bg-skyblue-600 hover:text-white hover:scale-[1.2] cursor-pointer disabled:opacity-0' />
		</Carousel>
	);
};

export default FeaturesCarousel;
