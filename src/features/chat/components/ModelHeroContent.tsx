import { images } from "@/shared/assets";

function ModelHeroContent() {
  return (
    <div>
      <img
        src={images.chatAi}
        alt="chat illustration"
        className="w-3xs h-52 max-md:w-2xs max-md:h-40 mx-auto mb-10"
      />
      <h2 className="font-bold text-skyblue-500 text-5xl max-md:text-4xl text-center mb-4">
        Welcome to Sync
      </h2>
      <p className="text-center text-lg text-[#64748B] max-w-2xl mx-auto mb-12">
        Your AI-powered assistant for managing meetings, files, and tasks
        seamlessly within your calendar. Ask questions, get summaries, and stay
        organized effortlessly.
      </p>
    </div>
  );
}

export default ModelHeroContent;
