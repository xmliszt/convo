import { Microphone } from '@phosphor-icons/react';
import React from 'react';

import { useRecordVoice } from "@/hooks/useRecordVoice";

export function MicrophoneButton() {
  const { startRecording, stopRecording } = useRecordVoice();

  return (
    <button
        onMouseDown={startRecording}   
        onMouseUp={stopRecording}       
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        className="border-none bg-transparent h-10"
    >
        <Microphone />
    </button>
  );
};
