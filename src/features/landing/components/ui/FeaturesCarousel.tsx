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
		<Carousel className='w-full max-w-[150px] sm:max-w-xs md:max-w-xl lg:max-w-4xl'>
			<CarouselContent className='-ml-4 sm:-ml-4'>
				{carouselItemsData.map((item) => (
					<CarouselItem
						className='pl-0.5 sm:pl-4 md:basis-1/2 lg:basis-1/4 '
						key={item.title}>
						<FeatureCard item={item} />
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className='size-0 sm:size-6 bg-skyblue-500 text-white hover:bg-skyblue-600 hover:text-white hover:scale-[1.2] cursor-pointer disabled:opacity-0' />
			<CarouselNext className='size-0 sm:size-6 bg-skyblue-500 text-white hover:bg-skyblue-600 hover:text-white hover:scale-[1.2] cursor-pointer disabled:opacity-0' />
		</Carousel>
	);
};

export default FeaturesCarousel;
