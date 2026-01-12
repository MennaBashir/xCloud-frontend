import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingFooter = () => {
  const isMobile = useIsMobile();
  const navigste = useNavigate();
  return (
    <div className="w-full container mx-auto flex justify-end p-4">
      {isMobile ? (
        <Button
          onClick={() => navigste("/app")}
          size={"icon"}
          className="bg-skyblue-500 text-white hover:bg-skyblue-600 cursor-pointer"
        >
          <ArrowRight className="size-4 text-white" />
        </Button>
      ) : (
        <Button
          onClick={() => navigste("/app")}
          className="ml-auto bg-skyblue-600 text-white hover:bg-skyblue-700 cursor-pointer"
        >
          <ArrowRight className="size-4 text-white" />
          Continue To Workspace
        </Button>
      )}
    </div>
  );
};

export default LandingFooter;
