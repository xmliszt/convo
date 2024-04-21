"use client";

import { Microphone } from '@phosphor-icons/react';
import { useEffect } from 'react';

import { useRecordVoice } from "./useRecordVoice";

export interface MicrophoneButtonProps {
    onRecordinRecieved?: (text: string) => void;
}

export function MicrophoneButton({ onRecordinRecieved }: MicrophoneButtonProps) {
    const { startRecording, stopRecording, text , isTranscribing } = useRecordVoice();

    useEffect(() => {
        if (onRecordinRecieved && text) {
            onRecordinRecieved(text);
        }
    }, [text, onRecordinRecieved]);

    return (
        <button
            disabled={isTranscribing}
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
