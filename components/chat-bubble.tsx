'use client';

import { Robot, User } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';

import { cn } from '@/lib/utils';

type ChatBubbleProps = {
  message: string;
  isUser: boolean;
};

export function ChatBubble(props: ChatBubbleProps) {
  const chatBubbleRef = useRef<HTMLDivElement>(null);

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
      ref={chatBubbleRef}
      className={cn(
        'flex items-start justify-start gap-x-2',
        props.isUser ? 'flex-row-reverse pl-10' : 'flex-row pr-10'
      )}
    >
      <motion.div
        className='table size-4 place-items-center rounded-full border bg-muted p-2 text-muted-foreground'
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        {props.isUser ? <User /> : <Robot />}
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
          props.isUser ? '!rounded-tr-[2px]' : '!rounded-tl-[2px]',
          props.isUser
            ? 'bg-[linear-gradient(145deg,#f1f1f1,#ffffff)]'
            : 'bg-[linear-gradient(215deg,#f1f1f1,#ffffff)]',
          props.isUser
            ? 'dark:bg-[linear-gradient(145deg,#000000,#292828)]'
            : 'dark:bg-[linear-gradient(215deg,#000000,#292828)]'
        )}
      >
        <Markdown className='prose dark:prose-invert'>{props.message}</Markdown>
      </motion.div>
    </div>
  );
}
