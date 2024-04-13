import { Robot, User } from '@phosphor-icons/react';
import Markdown from 'react-markdown';

import { cn } from '@/lib/utils';

type ChatBubbleProps = {
  message: string;
  isUser: boolean;
};

export function ChatBubble(props: ChatBubbleProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-start gap-x-2',
        props.isUser ? 'flex-row-reverse pl-10' : 'flex-row pr-10'
      )}
    >
      <div className='table size-4 place-items-center rounded-full border bg-muted p-2 text-muted-foreground'>
        {props.isUser ? <User /> : <Robot />}
      </div>
      {props.isUser ? (
        <div className='rounded-lg !rounded-tr-[2px] border bg-muted p-2'>
          <Markdown className='prose prose-zinc text-foreground dark:prose-invert '>
            {props.message}
          </Markdown>
        </div>
      ) : (
        <div className='rounded-lg !rounded-tl-[2px] border bg-foreground p-2'>
          <Markdown className='prose prose-invert text-background dark:prose-zinc '>
            {props.message}
          </Markdown>
        </div>
      )}
    </div>
  );
}
