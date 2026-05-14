import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon,CheckIcon } from 'lucide-react';
import { Fragment, useState } from 'react'
import React from "react";
import DropCAM from '../icons/DropDown/DropCAM';
import { useMeetingAppContext } from '../MeetingAppContextDef';

export default function DropDownCam({
  webcams,
  changeWebcam
}) {

  const {
    setSelectedWebcam,
    selectedWebcam,
    isCameraPermissionAllowed
  } = useMeetingAppContext()
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Popover className="relative w-full">
        {({ open }) => (
          <>
            <Popover.Button
              onMouseEnter={() => { setIsHovered(true) }}
              onMouseLeave={() => { setIsHovered(false) }}
              disabled={!isCameraPermissionAllowed}
              className={`focus:outline-none hover:ring-1 hover:ring-[#B2CBF6] hover:bg-[#F9FAFB] 
              ${open
                  ? "text-[#162E54] ring-1 ring-[#B2CBF6] bg-[#F9FAFB]"
                  : "text-[#64748B] hover:text-[#162E54] border border-slate-200"
                }
              group inline-flex items-center rounded-lg px-2 py-1.5 w-full text-sm font-normal
              ${!isCameraPermissionAllowed ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div>
                <DropCAM fillColor={isHovered || open ? "#3B82F6" : "#8695AA"} />

              </div>
              <span className=" overflow-hidden whitespace-nowrap overflow-ellipsis w-full ml-7">
                {isCameraPermissionAllowed ? selectedWebcam?.label : "Permission Needed"}
              </span>

              <ChevronDownIcon
                className={`${open ? 'text-[#3B82F6]' : 'text-[#8695AA]'}
                ml-8 h-5 w-10 transition duration-150 ease-in-out group-hover:text-[#3B82F6] mt-1`}
                aria-hidden="true"
              />

            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute bottom-full z-10 mt-3 w-full px-4 sm:px-0 pb-2">
                <div className="rounded-lg shadow-lg">
                  <div className="bg-skyblue-500 border border-slate-200 rounded-lg">
                    <div>
                      <div className="flex flex-col">
                        {webcams.map(
                          (item, index) => {
                            return (
                              item?.kind === "videoinput" && (
                                <div
                                  key={`webcams_${index}`}
                                  className={` my-1 pl-4 pr-2 text-white text-left flex`}
                                >
                                  <span className="w-6 mr-2 flex items-center justify-center">
                                    {selectedWebcam?.label === item?.label && (
                                      <CheckIcon className='h-5 w-5' />
                                    )}
                                  </span>
                                  <button
                                    className={`flex flex-1 w-full text-left`}
                                    value={item?.deviceId}
                                    onClick={() => {
                                      setSelectedWebcam(
                                        (s) => ({
                                          ...s,
                                          id: item?.deviceId,
                                          label: item?.label
                                        })
                                      );
                                      changeWebcam(item?.deviceId);
                                    }}
                                  >
                                    {item?.label ? (
                                      <span>{item?.label}</span>
                                    ) : (
                                      <span >{`Webcam ${index + 1}`}</span>
                                    )}
                                  </button>
                                </div>
                              )
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  )
}

