import { useEffect, useState } from 'react';

export function useMicrophonePermission() {
  const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(false);
  const [isMicrophoneBlockedByExtensions, setIsMicrophoneBlockedByExtensions] =
    useState(false);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(
          // constraints - only audio needed for this app
          {
            audio: true,
          }
        )
        .then(() => {
          setIsMicrophoneAvailable(true);
          setIsMicrophoneBlockedByExtensions(false);
        })
        .catch((err) => {
          console.log(err);
          setIsMicrophoneAvailable(false);
          if (err.name === 'NotAllowedError') {
            setIsMicrophoneBlockedByExtensions(true);
          } else {
            setIsMicrophoneBlockedByExtensions(false);
          }
        });
    } else {
      console.log('getUserMedia not supported on your browser!');
    }
  }, []);

  return {
    isMicrophoneAvailable,
    isMicrophoneBlockedByExtensions,
  };
}
