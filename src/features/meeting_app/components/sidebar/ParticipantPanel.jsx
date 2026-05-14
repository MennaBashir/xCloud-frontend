import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import React, { useMemo } from "react";
import MicOffIcon from "../../icons/ParticipantTabPanel/MicOffIcon";
import MicOnIcon from "../../icons/ParticipantTabPanel/MicOnIcon";
import RaiseHand from "../../icons/ParticipantTabPanel/RaiseHand";
import VideoCamOffIcon from "../../icons/ParticipantTabPanel/VideoCamOffIcon";
import VideoCamOnIcon from "../../icons/ParticipantTabPanel/VideoCamOnIcon";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import { nameTructed } from "../../utils/helper";

function ParticipantListItem({ participantId, raisedHand }) {
  const { micOn, webcamOn, displayName, isLocal } =
    useParticipant(participantId);

  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-[#E1EAFB] transition-colors mx-2 mt-1">
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 text-sm rounded-full flex items-center justify-center text-white bg-[#3B82F6]"
        >
          {displayName?.charAt(0).toUpperCase()}
        </div>
        <p className="text-sm text-[#162E54] font-bold overflow-hidden whitespace-pre-wrap overflow-ellipsis">
          {isLocal ? "You" : nameTructed(displayName, 15)}
        </p>
        {raisedHand && (
          <div className="flex items-center justify-center">
            <RaiseHand fillcolor={"#F5C30D"} />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className={`p-2 w-8 h-8 rounded-full flex items-center justify-center ${micOn ? "bg-[#DCE8FE]" : "bg-[#F9FAFB]"}`}>
          {micOn ? <MicOnIcon /> : <MicOffIcon />}
        </div>
        <div className={`p-2 w-8 h-8 rounded-full flex items-center justify-center ${webcamOn ? "bg-[#DCE8FE]" : "bg-[#F9FAFB]"}`}>
          {webcamOn ? <VideoCamOnIcon /> : <VideoCamOffIcon />}
        </div>
      </div>
    </div>
  );
}

export function ParticipantPanel({ panelHeight }) {
  const { raisedHandsParticipants } = useMeetingAppContext();
  const mMeeting = useMeeting();
  const participants = mMeeting.participants;

  const sortedRaisedHandsParticipants = useMemo(() => {
    const participantIds = [...participants.keys()];

    const notRaised = participantIds.filter(
      (pID) =>
        raisedHandsParticipants.findIndex(
          ({ participantId: rPID }) => rPID === pID
        ) === -1
    );

    const raisedSorted = raisedHandsParticipants.sort((a, b) => {
      if (a.raisedHandOn > b.raisedHandOn) {
        return -1;
      }
      if (a.raisedHandOn < b.raisedHandOn) {
        return 1;
      }
      return 0;
    });

    const combined = [
      ...raisedSorted.map(({ participantId: p }) => ({
        raisedHand: true,
        participantId: p,
      })),
      ...notRaised.map((p) => ({ raisedHand: false, participantId: p })),
    ];

    return combined;
  }, [raisedHandsParticipants, participants]);

  const filterParticipants = (sortedRaisedHandsParticipants) =>
    sortedRaisedHandsParticipants;

  const part = useMemo(
    () => filterParticipants(sortedRaisedHandsParticipants, participants),

    [sortedRaisedHandsParticipants, participants]
  );

  return (
    <div
      className={`flex w-full flex-col bg-[#F9FAFB] overflow-y-auto`}
      style={{ height: panelHeight }}
    >
      <div
        className="flex flex-col flex-1"
        style={{ height: panelHeight - 100 }}
      >
        {[...participants.keys()].map((participantId, index) => {
          const { raisedHand, participantId: peerId } = part[index];
          return (
            <ParticipantListItem
              participantId={peerId}
              raisedHand={raisedHand}
            />
          );
        })}
      </div>
    </div>
  );
}
