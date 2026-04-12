import { useMeeting, useParticipant, VideoPlayer } from "@videosdk.live/react-sdk";
import { useEffect, useRef } from "react";
import MicOffSmallIcon from "../icons/MicOffSmallIcon";
import ScreenShareIcon from "../icons/ScreenShareIcon";
import SpeakerIcon from "../icons/SpeakerIcon";
import { nameTructed } from "../utils/helper";
import { CornerDisplayName } from "./ParticipantView";

export function PresenterView({ height }) {
  const mMeeting = useMeeting();
  const presenterId = mMeeting?.presenterId;
  const {
    micOn,
    webcamOn,
    isLocal,
    screenShareAudioStream,
    screenShareOn,
    displayName,
    isActiveSpeaker,
  } = useParticipant(presenterId);


  const audioPlayer = useRef();

  useEffect(() => {
    if (
      !isLocal &&
      audioPlayer.current &&
      screenShareOn &&
      screenShareAudioStream
    ) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(screenShareAudioStream.track);

      audioPlayer.current.srcObject = mediaStream;
      audioPlayer.current.play().catch((err) => {
        if (
          err.message ===
          "play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD"
        ) {
          console.error("audio" + err.message);
        }
      });
    } else {
      audioPlayer.current.srcObject = null;
    }
  }, [screenShareAudioStream, screenShareOn, isLocal]);

  return (
    <div
      className="bg-slate-900 rounded-2xl m-2 relative overflow-hidden w-full border border-slate-700 shadow-lg"
      style={{ height }}
    >
      <audio autoPlay playsInline controls={false} ref={audioPlayer} />
      <div className={"video-contain absolute h-full w-full"}>

        <VideoPlayer
          participantId={presenterId} // Required
          type="share" // "video" or "share"
          containerStyle={{
            height: "100%",
            width: "100%",
          }}
          className="h-full"
          classNameVideo="h-full"
          videoStyle={{
            filter: isLocal ? "blur(1rem)" : undefined,
          }}
        />

        <div
          className="absolute top-4 left-4 bg-black/70 backdrop-blur text-white px-3 py-1.5 rounded-lg z-10 text-sm flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          {!micOn ? (
            <MicOffSmallIcon fillcolor="#8695AA" />
          ) : micOn && isActiveSpeaker ? (
            <SpeakerIcon />
          ) : (
            <></>
          )}

          <p className="text-sm text-white">
            {isLocal
              ? `You are presenting`
              : `${nameTructed(displayName, 15)} is presenting`}
          </p>
        </div>
        {isLocal ? (
          <>
            <div className="p-10 rounded-2xl flex flex-col items-center justify-center absolute top-1/2 left-1/2 bg-black/70 backdrop-blur transform -translate-x-1/2 -translate-y-1/2">
              <ScreenShareIcon
                style={{ height: 48, width: 48, color: "white" }}
              />
              <div className="mt-4">
                <p className="text-white text-xl font-semibold">
                  You are presenting to everyone
                </p>
              </div>
              <div className="mt-8">
                <button
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm text-center font-medium transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    mMeeting.toggleScreenShare();
                  }}
                >
                  STOP PRESENTING
                </button>
              </div>
            </div>
            <CornerDisplayName
              {...{
                isLocal,
                displayName,
                micOn,
                webcamOn,
                isPresenting: true,
                participantId: presenterId,
                isActiveSpeaker,
              }}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
