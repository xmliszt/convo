'use client';

import {
  Bug,
  Microphone,
  Robot,
  Spinner,
  User,
  UserSound,
} from '@phosphor-icons/react';
import { SpeakerHigh } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import Markdown from 'react-markdown';

import { cn } from '@/lib/utils';

import { readText } from './services/text-to-speech';

type ChatBubbleProps = {
  id: string;
  message: string;
  isUser: boolean;
  isRecording: boolean;
  isError?: boolean;
  avatarUrl?: string;
  gender?: 'male' | 'female';
  onRetry?: () => void;
};

function base64ToArrayBuffer(base64: string) {
  const binaryString = window.atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

export function ChatBubble(props: ChatBubbleProps) {
  const chatBubbleRef = useRef<HTMLDivElement>(null);

  const [isLoadingAudio, startPlaying] = useTransition();
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);

  const handleTextToSpeech = useCallback(() => {
    if (source) {
      source.stop();
      setSource(null);
      return;
    }

    startPlaying(async () => {
      try {
        const base64Mp3 = await readText(props.message, props.gender);
        if (base64Mp3) {
          const arrayBuffer = base64ToArrayBuffer(base64Mp3);
          const audioContext = new AudioContext();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const newSource = audioContext.createBufferSource(); // Create a new source node
          newSource.buffer = audioBuffer;
          newSource.connect(audioContext.destination);
          newSource.onended = () => {
            setSource(null);
          };
          newSource.start();
          setSource(newSource);
        }
      } catch (error) {
        setSource(null);
        console.error(error);
      }
    });
  }, [source, props.gender, props.message]);

  // When bubble appears, scroll it into view smoothly if needed.
  useEffect(() => {
    if (chatBubbleRef.current) {
      chatBubbleRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, []);

  return (
    <div
      id={props.id}
      ref={chatBubbleRef}
      className={cn(
        'flex items-start justify-start gap-x-2',
        props.isUser || props.isRecording
          ? 'flex-row-reverse pl-10'
          : 'flex-row pr-10'
      )}
    >
      <motion.div
        className='flex min-h-10 min-w-10 flex-col items-center justify-center rounded-full border bg-muted text-muted-foreground'
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        {/* User icon */}
        {props.isUser ? (
          <User />
        ) : props.isRecording ? (
          <Microphone />
        ) : props.isError ? (
          <Bug />
        ) : props.avatarUrl ? (
          <Image
            src={props.avatarUrl}
            alt='Avatar'
            width={40}
            height={40}
            className='rounded-full border shadow-lg'
            unoptimized
          />
        ) : (
          <Robot />
        )}
        {!(props.isUser || props.isRecording || props.isError) && (
          <motion.button
            className='flex items-center justify-center p-3'
            onClick={handleTextToSpeech}
          >
            {source !== null ? (
              <UserSound />
            ) : isLoadingAudio ? (
              <Spinner className='animate-spin' />
            ) : (
              <SpeakerHigh />
            )}
          </motion.button>
        )}
      </motion.div>

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.5,
            type: 'spring',
            bounce: 0.5,
            duration: 0.5,
          },
        }}
        className={cn(
          'rounded-lg border bg-secondary px-3 pb-2 pt-1 shadow-inner',
          props.isUser || props.isRecording
            ? '!rounded-tr-[2px]'
            : '!rounded-tl-[2px]',
          props.isUser || props.isRecording
            ? 'bg-[linear-gradient(145deg,#f1f1f1,#ffffff)]'
            : 'bg-[linear-gradient(215deg,#f1f1f1,#ffffff)]',
          props.isUser || props.isRecording
            ? 'dark:bg-[linear-gradient(145deg,#000000,#292828)]'
            : 'dark:bg-[linear-gradient(215deg,#000000,#292828)]'
        )}
      >
        <Markdown
          className={cn(
            'prose prose-neutral dark:prose-invert',
            props.isError && 'text-red-500'
          )}
        >
          {props.message}
        </Markdown>
        {props.isError && (
          <button
            className='mt-1 text-xs text-secondary-foreground/70 transition-colors hover:text-secondary-foreground'
            onClick={props.onRetry}
          >
            Refresh to try again
          </button>
        )}
      </motion.div>
    </div>
  );
}
