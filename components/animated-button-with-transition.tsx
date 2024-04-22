'use client';

import { Spinner } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { MouseEventHandler } from 'react';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';

type AnimatedButtonWithTransitionProps = {
  normalLabel: string;
  loadingLabel: string;
  normalIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
  isPending?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  className?: string;
};

export function AnimatedButtonWithTransition(
  props: AnimatedButtonWithTransitionProps
) {
  return (
    <AnimatePresence>
      <motion.div
        key='game-over-button'
        className={cn('grid w-full place-items-stretch', props.className)}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 20,
        }}
      >
        <Button
          className='border-border font-bold hover:border hover:bg-accent/60 hover:text-primary hover:shadow-2xl'
          onClick={props.onClick}
          disabled={props.disabled || props.isPending}
          variant={props.variant ?? 'default'}
        >
          {props.isPending ? (
            <motion.span
              key={'button-evaluating'}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className='flex items-center gap-x-2'
            >
              {props.loadingIcon ?? <Spinner className='animate-spin' />}
              {props.loadingLabel}
            </motion.span>
          ) : (
            <motion.span
              key={'button-idle'}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className='flex items-center gap-x-2'
            >
              {props.normalIcon}
              {props.normalLabel}
            </motion.span>
          )}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
