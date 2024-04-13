'use client';

import { useChat } from 'ai/react';

import { ChatBubble } from '@/components/chat-bubble';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/stream',
  });

  return (
    <div className='grid h-full w-full max-w-lg grid-cols-1 grid-rows-[auto_32px] gap-8'>
      <ScrollArea className='max-h-[80vh] rounded-lg border px-8 shadow-xl'>
        <div className='flex flex-col gap-4 py-10'>
          {messages.map((m) => (
            <ChatBubble
              key={m.id}
              message={m.content}
              isUser={m.role === 'user'}
            />
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit}>
        <Input
          value={input}
          placeholder='Say something...'
          onChange={handleInputChange}
          className='transition-[box-shadow] duration-300 ease-out focus:shadow-2xl'
        />
      </form>
    </div>
  );
}
