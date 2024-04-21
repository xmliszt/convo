import { useEffect, useRef,useState } from "react";


type UseRecordVoiceReturnType = {
    recording: boolean;
    startRecording: () => void;
    stopRecording: () => void;
    text: string;
}

function blobToBase64(blob: Blob, callback: (base64data: string | null) => void) {
    const reader = new FileReader();
    reader.onload = function () {
        const base64data = reader?.result?.toString().split(",")[1] ?? null;
        callback(base64data);
    };
    reader.readAsDataURL(blob);
}

const createMediaStream = (stream: MediaStream, isRecording: boolean) => {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const analyzer = context.createAnalyser();
    source.connect(analyzer);
    const tick = () => {
        if (isRecording) requestAnimationFrame(tick);
    };
    tick();
};

export const useRecordVoice = (): UseRecordVoiceReturnType => {
    const [text, setText] = useState<string>("");
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recording, setRecording] = useState<boolean>(false);
    const isRecording = useRef<boolean>(false);
    const chunks = useRef<Blob[]>([]);
    // const [isTranscribing, startTranscribing] = useTransition();

    const startRecording = () => {
        if (mediaRecorder) {
            isRecording.current = true;
            mediaRecorder.start();
            setRecording(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            isRecording.current = false;
            mediaRecorder.stop();
            setRecording(false);
        }
    };

    // const getText = useCallback((base64data: string | null) => {
    //     if (isTranscribing) return;
    //     startTranscribing(async () => {
    //         try {
    //             if (base64data) {
    //                 // const transcript = await speechToText(readStream);
    //                 // setText(transcript);
    //                 const response = await fetch("/api/speech-to-text", {
    //                     method: "POST",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     body: JSON.stringify({
    //                         audio: base64data,
    //                     }),
    //                 }).then((res) => res.json());
    //                 const { text } = response;
    //                 setText(text);
    //             } else {
    //                 console.log("Error: Base64 data is null or empty");
    //             }
    //         } catch (error) {
    //             console.error("Error processing audio:", error);
    //         }
    //     })
    // }, [isTranscribing])

    // const initialMediaRecorder = useCallback((stream: MediaStream) => {
    //     const mediaRecorder = new MediaRecorder(stream);
    //     mediaRecorder.onstart = () => {
    //         createMediaStream(stream, isRecording.current);
    //         chunks.current = [];
    //     };
    //     mediaRecorder.ondataavailable = (ev: BlobEvent) => {
    //         chunks.current.push(ev.data);
    //     };
    //     mediaRecorder.onstop = () => {
    //         const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
    //         blobToBase64(audioBlob, getText);
    //     };
    //     setMediaRecorder(mediaRecorder);
    // }, [getText])

    // useEffect(() => {
    // if (typeof window !== "undefined") {
    //     navigator.mediaDevices
    //     .getUserMedia({ audio: true })
    //     .then(initialMediaRecorder);
    // }
    // }, [initialMediaRecorder]);

    const getText = async (base64data) => {
        try {
            const response = await fetch("/api/speech-to-text", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    audio: base64data,
                }),
            }).then((res) => res.json());
            const { text } = response;
            setText(text);
        } catch (error) {
            console.log(error);
        }
    };
    
    const initialMediaRecorder = (stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.onstart = () => {
            createMediaStream(stream);
            chunks.current = [];
        };

        mediaRecorder.ondataavailable = (ev) => {
            chunks.current.push(ev.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
            blobToBase64(audioBlob, getText);
        };

        setMediaRecorder(mediaRecorder);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(initialMediaRecorder);
        }
    }, []);
    

    return { recording, startRecording, stopRecording, text};
};
