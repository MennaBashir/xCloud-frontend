import React from "react";
import { mockFiles } from "../utils/data/mockData";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { images } from "../assets";

function RecentFiles() {
	return (
		<div>
			<div className='mb-7'>
				<h2 className='text-skyblue-950 text-3xl font-bold mb-2 '>Recent</h2>
				<p className='text-skyblue-950 text-2xl font-medium'>
					Here are your recently summarized files.
				</p>
			</div>
			<div className='flex flex-wrap gap-4  max-sm:justify-center'>
				{
					/* Recently edited files will be displayed here in the future */
					mockFiles.map((file) => (
						<React.Fragment key={file.id}>
							<HeroVideoDialog
								className='block'
								animationStyle='from-center'
								videoSrc={file.url}
								thumbnailSrc={images.thumbnailImage}
								// thumbnailSrc="https://image-processor-storage.s3.us-west-2.amazonaws.com/images/3cf61c1011912a2173ea4dfa260f1108/halo-of-neon-ring-illuminated-in-the-stunning-landscape-of-yosemite.jpg"
								thumbnailAlt='Dummy Video Thumbnail'
								file={file}
							/>
						</React.Fragment>
					))
				}
			</div>
		</div>
	);
}

export default RecentFiles;
