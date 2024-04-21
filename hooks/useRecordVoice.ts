import { useEffect, useRef,useState } from "react";

interface UseRecordVoiceReturnType {
  recording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export const useRecordVoice = (): UseRecordVoiceReturnType => {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

    const [recording, setRecording] = useState(false);

    const chunks = useRef<Blob[]>([]);

    const startRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.start();
            setRecording(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop(); 
            setRecording(false);
        }
    };

    const initialMediaRecorder = (stream: MediaStream) => {
    const newMediaRecorder = new MediaRecorder(stream);

    newMediaRecorder.onstart = () => {
        chunks.current = [];
    };

    newMediaRecorder.ondataavailable = (ev: BlobEvent) => {
        chunks.current.push(ev.data);
    };

    newMediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
        console.log(audioBlob, 'audioBlob');

    };

    setMediaRecorder(newMediaRecorder);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(initialMediaRecorder);
        }
    }, []); 

    return { recording, startRecording, stopRecording };
};