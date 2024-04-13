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
      <div className='table size-4 place-items-center rounded-full border border-primary bg-muted p-2 text-muted-foreground'>
        {props.isUser ? <User /> : <Robot />}
      </div>
      {props.isUser ? (
        <div className='rounded-lg !rounded-tr-[2px] border border-primary bg-secondary bg-[linear-gradient(215deg,#f1f1f1,#ffffff)] px-3 py-1 shadow-md dark:bg-[linear-gradient(215deg,#000000,#292828)]'>
          <Markdown className='prose dark:prose-invert'>
            {props.message}
          </Markdown>
        </div>
      ) : (
        <div className='rounded-lg !rounded-tl-[2px] border border-primary bg-[linear-gradient(145deg,#f1f1f1,#ffffff)] px-3 py-1 shadow-md dark:bg-[linear-gradient(145deg,#000000,#292828)]'>
          <Markdown className='prose dark:prose-invert'>
            {props.message}
          </Markdown>
        </div>
      )}
    </div>
  );
}
