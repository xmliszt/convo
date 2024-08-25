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
        .catch((error) => {
          console.error(error);
          setIsMicrophoneAvailable(false);
          if (error.name === 'NotAllowedError') {
            setIsMicrophoneBlockedByExtensions(true);
          } else {
            setIsMicrophoneBlockedByExtensions(false);
          }
        });
    } else {
      console.warn('getUserMedia not supported on your browser!');
    }
  }, []);

  return {
    isMicrophoneAvailable,
    isMicrophoneBlockedByExtensions,
  };
}
