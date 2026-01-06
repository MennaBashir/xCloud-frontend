import { Card, CardContent } from "@/components/ui/card";
import type { CarouselItem } from "../../types/CarouselItem";

interface FeatureCardProps {
	item: CarouselItem;
}
const FeatureCard = ({ item }: FeatureCardProps) => {
	return (
		<Card className='w-full h-[365px] bg-skyblue-50 cursor-pointer hover:shadow-lg hover:shadow-skyblue-200 rounded-xs border-0 transition-shadow'>
			<CardContent>
				<img
					className='max-w-full object-cover'
					src={item.img}
					alt={item.title}
				/>
				<div className='flex flex-col justify-center gap-2 mt-2'>
					<p className='text-start mt-2 text-primary-heading-text-color font-semibold text-sm sm:font-bold sm:text-lg'>
						{item.title}
					</p>
					{item.features.map((feature, index) => (
						<div key={index} className='flex items-center gap-1 sm:gap-2'>
							<img className='size-3 sm:size-5' src={feature.icon} alt='icon' />
							<p className='font-normal sm:font-bold text-xs sm:text-sm text-primary-text-color'>
								{feature.text}
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default FeatureCard;
