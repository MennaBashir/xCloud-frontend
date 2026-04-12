import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import React, { useEffect, useRef, useState } from "react";
import { formatAMPM, json_verify, nameTructed } from "../../utils/helper";
import { Paperclip } from "lucide-react";


const ChatMessage = ({ senderId, senderName, text, timestamp }) => {
  const mMeeting = useMeeting();
  const localParticipantId = mMeeting?.localParticipant?.id;
  const localSender = localParticipantId === senderId;

  return (
    <div
      className={`flex w-full mb-4 ${localSender ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex flex-col max-w-[75%] ${localSender ? "items-end" : "items-start"}`}
      >
        {!localSender && (
          <span className="text-[#162E54] text-sm font-bold mb-1 ml-1">
            {nameTructed(senderName, 15)}
          </span>
        )}
        <div
          className={`px-4 py-2 text-sm rounded-2xl ${
            localSender
              ? "bg-[#B2CBF6] text-[#162E54] rounded-br-sm"
              : "bg-[#F4F7FB] text-[#475569] rounded-bl-sm"
          }`}
          style={{ wordBreak: "break-word" }}
        >
          {text}
        </div>
        <span className="text-[10px] text-slate-400 mt-1 mx-1">
          {new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

const ChatInput = ({ inputHeight }) => {
  const [message, setMessage] = useState("");
  const { publish } = usePubSub("CHAT");
  const input = useRef();

  return (
    <div
      className="w-full flex items-center px-2 mt-auto pt-2"
      style={{ height: inputHeight }}
    >
      <div className="flex items-center bg-gray-100 rounded-full border border-slate-200 overflow-hidden shadow-sm w-full">
        <input
          type="text"
          className="flex-1 pl-4 py-3 border-none bg-transparent text-sm text-[#162E54] outline-none"
          placeholder="Type your message here..."
          autoComplete="off"
          ref={input}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const messageText = message.trim();

              if (messageText.length > 0) {
                try {
                  publish(messageText, { persist: true });
                  setTimeout(() => {
                    setMessage("");
                  }, 100);
                  input.current?.focus();
                } catch (e) {
                  console.log("Error in pubsub", e)
                }
              }
            }
          }}
        />
        <button
          disabled={message.length < 2}
          type="submit"
          className="p-2 mr-1 rounded-full hover:bg-blue-50 transition-colors"
          onClick={() => {
            const messageText = message.trim();
            if (messageText.length > 0) {
              try {
                publish(messageText, { persist: true });
                setTimeout(() => {
                  setMessage("");
                }, 100);
                input.current?.focus();
              } catch (e) {
                console.log("Error in pubsub", e)
              }
            }
          }}
        >
          <Paperclip
            className={`w-5 h-5 ${message.length < 2 ? "text-gray-400" : "text-[#3B82F6]"}`}
          />
        </button>
      </div>
    </div>
  );
};

const ChatMessages = ({ listHeight }) => {
  const listRef = useRef();
  const { messages } = usePubSub("CHAT");

  const scrollToBottom = (data) => {
    if (!data) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    } else {
      const { text } = data;

      if (json_verify(text)) {
        const { type } = JSON.parse(text);
        if (type === "CHAT") {
          if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
          }
        }
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return messages ? (
    <div ref={listRef} style={{ overflowY: "scroll", height: listHeight }}>
      <div className="p-4">
        {messages.map((msg, i) => {
          const { senderId, senderName, message, timestamp } = msg;
          return (
            <ChatMessage
              key={`chat_item_${i}`}
              {...{ senderId, senderName, text: message, timestamp }}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <p>No messages</p>
  );
};

export function ChatPanel({ panelHeight }) {
  const inputHeight = 72;
  const listHeight = panelHeight - inputHeight;

  return (
    <div>
      <ChatMessages listHeight={listHeight} />
      <ChatInput inputHeight={inputHeight} />
    </div>
  );
}
