import { useState } from "react";
import { toast } from "react-toastify";
import { CheckIcon } from "lucide-react";
import { ClipboardCopyIcon } from "lucide-react";

export function MeetingDetailsScreen({
  onClickJoin,
  _handleOnCreateMeeting,
  participantName,
  setParticipantName,
  onClickStartMeeting,
}) {
  const [meetingId, setMeetingId] = useState("");
  const [meetingIdError, setMeetingIdError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [iscreateMeetingClicked, setIscreateMeetingClicked] = useState(false);
  const [isJoinMeetingClicked, setIsJoinMeetingClicked] = useState(false);

  return (
    <div
      className={`flex flex-1 flex-col justify-center w-full md:p-[6px] sm:p-1 p-1.5`}
    >
      {iscreateMeetingClicked ? (
        <div className="border border-solid border-gray-400 rounded-xl px-4 py-3  flex items-center justify-center">
          <p className="text-white text-base">
            {`Meeting code : ${meetingId}`}
          </p>
          <button
            className="ml-2"
            onClick={() => {
              navigator.clipboard.writeText(meetingId);
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 3000);
            }}
          >
            {isCopied ? (
              <CheckIcon className="h-5 w-5 text-green-400" />
            ) : (
              <ClipboardCopyIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      ) : isJoinMeetingClicked ? (
        <>
          <input
            defaultValue={meetingId}
            onChange={(e) => {
              setMeetingId(e.target.value);
            }}
            placeholder={"Enter meeting Id"}
            className="px-4 py-3 border border-gray-400 rounded-xl text-white w-full text-center"
          />
          {/* toast error if meetingId is invalid
          {meetingIdError ? (
            <>
              {toast.error(`Please enter valid meetingId`, {
                position: "top-left",
                autoClose: 4000,
                hideProgressBar: true,
                closeButton: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
              })}
            </>
          ) : null} */}

          {meetingIdError && (
            <p className=" text-red-700 mt-2">{`Please enter valid meetingId`}</p>
          )}
        </>
      ) : null}

      {(iscreateMeetingClicked || isJoinMeetingClicked) && (
        <>
          <input
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter your name"
            className="px-4 py-3 mt-5 border border-gray-400 rounded-xl text-white w-full text-center"
          />
          <button
            disabled={participantName.length < 3}
            className={`w-full ${
              participantName.length < 3
                ? "bg-black cursor-not-allowed"
                : "bg-purple cursor-pointer"
            }  text-white px-2 py-3 rounded-xl mt-5`}
            onClick={(e) => {
              if (iscreateMeetingClicked) {
                onClickStartMeeting();
              } else {
                //  must check meetingId correct or not before joining meeting
                // will this condition change in future when we will integrate with backend or auth server
                if (meetingId.length > 2) {
                  onClickJoin(meetingId);
                  setMeetingIdError(false);
                } else setMeetingIdError(true);
              }
            }}
          >
            {iscreateMeetingClicked ? "Start a meeting" : "Join a meeting"}
          </button>
          {/* button to back to create meeting */}
          <button
            className="w-full bg-gray-500 cursor-pointer text-white px-2 py-3 rounded-xl mt-5"
            onClick={(e) => {
              setIscreateMeetingClicked(false);
              setIsJoinMeetingClicked(false);
              setMeetingId("");
              setParticipantName("");
              setMeetingIdError(false);
            }}
          >
            Back
          </button>
        </>
      )}

      {!iscreateMeetingClicked && !isJoinMeetingClicked && (
        <div className="w-full md:mt-0 mt-4 flex flex-col">
          <div className="flex items-center justify-center flex-col w-full ">
            <button
              className="w-full bg-black cursor-pointer text-white px-2 py-3 rounded-xl"
              onClick={async (e) => {
                const { meetingId, err } = await _handleOnCreateMeeting();

                if (meetingId) {
                  setMeetingId(meetingId);
                  setIscreateMeetingClicked(true);
                } else {
                  toast.error(`${err}`, {
                    position: "top-left",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeButton: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                  });
                }
              }}
            >
              Create a meeting
            </button>
            <button
              className="w-full bg-black cursor-pointer text-white px-2 py-3 rounded-xl mt-5"
              onClick={(e) => {
                setIsJoinMeetingClicked(true);
              }}
            >
              Join a meeting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
