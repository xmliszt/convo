'use client';

import { useChat } from 'ai/react';
import { motion } from 'framer-motion';

import { ChatBubble } from '@/components/chat-bubble';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/stream',
  });

  return (
    <>
      <ScrollArea className='flex h-screen w-full px-4'>
        <div className='grid h-full w-full place-items-center py-10'>
          <div className='flex w-full max-w-lg flex-col gap-4 py-10'>
            {messages.map((m) => (
              <ChatBubble
                key={m.id}
                message={m.content}
                isUser={m.role === 'user'}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
      <motion.div
        className={cn(
          'fixed bottom-0 z-50 w-full bg-background/60 py-4',
          // gradient glass effect
          'shadow-inner backdrop-blur-[10px] [mask:linear-gradient(to_top,black_0%,black_75%,transparent_100%)]'
        )}
        initial={{
          y: 20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            bounce: 0.8,
            stiffness: 100,
            duration: 0.3,
          },
        }}
      >
        {' '}
        <form
          onSubmit={handleSubmit}
          className='grid w-full place-items-center px-4'
        >
          <Input
            value={input}
            placeholder='Type a message...'
            onChange={handleInputChange}
            className='max-w-lg transition-[box-shadow] duration-300 ease-out focus:shadow-xl'
          />
        </form>
      </motion.div>
    </>
  );
}
