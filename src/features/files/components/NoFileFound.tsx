import { images } from "../utils/assets";

function NoFileFound() {
  return (
    <div>
      <div className="w-fit mx-auto text-center flex flex-col items-center gap-6">
        <div>
          <img src={images.noFiles} alt="No File Found" />
        </div>
        <h2 className="font-bold text-skyblue-950 text-5xl -mt-12 max-lg:text-4xl">
          No files uploaded yet
        </h2>
      </div>
    </div>
  );
}

export default NoFileFound;
