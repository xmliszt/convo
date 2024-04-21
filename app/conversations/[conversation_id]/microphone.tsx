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
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 10,
      }}
      variants={{
        initial: {
          opacity: 0,
          y: 10,
        },
        hover: {
          opacity: 1,
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
