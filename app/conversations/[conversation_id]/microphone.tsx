'use client';

import { MicrophoneSlash, MicrophoneStage } from '@phosphor-icons/react';
import { motion, Variants } from 'framer-motion';

import { cn } from '@/lib/utils';

type MicrophoneProps = {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
};

/**
 * Controllable microphone button.
 */
export function Microphone(props: MicrophoneProps) {
  const microphoneVariants: Variants = {
    initial: {
      rotate: 0,
    },
    hover: {
      rotate: [0, -15, 15, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
      },
    },
  };
  return (
    <motion.button
      type='button'
      onClick={() => {
        if (props.isRecording) {
          props.onStopRecording();
        } else {
          props.onStartRecording();
        }
      }}
      className={cn(
        'absolute bottom-1 right-1 top-1 z-20 grid size-8 place-items-center rounded-sm p-2 transition-[background-color_color] duration-200',
        props.isRecording ? 'bg-destructive/80 !text-white' : 'bg-card/80'
      )}
      initial='initial'
      whileHover='hover'
      animate={props.isRecording ? 'recording' : 'visible'}
      exit={{
        opacity: 0,
        y: 10,
      }}
      variants={{
        initial: {
          opacity: 0,
          y: 10,
        },
        visible: {
          opacity: 1,
          scale: 1,
          rotate: 0,
          y: 0,
        },
        hover: {
          opacity: 1,
        },
        recording: {
          y: 0,
          opacity: [1, 0.5, 1],
          scale: [1, 0.7, 1],
          transition: {
            duration: 1,
            repeat: Infinity,
          },
        },
      }}
    >
      <motion.span
        variants={microphoneVariants}
        className={cn(props.isRecording ? 'text-white' : 'text-primary')}
      >
        {props.isRecording ? <MicrophoneStage /> : <MicrophoneSlash />}
      </motion.span>
    </motion.button>
  );
}
