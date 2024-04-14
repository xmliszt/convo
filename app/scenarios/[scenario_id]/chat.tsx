'use client';

import { Content } from '@google/generative-ai';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState, useTransition } from 'react';

import { ChatBubble } from '@/components/chat-bubble';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { useScenarioBackground } from '../scenario-background-provider';
import { useScenarioGoal } from './scenario-goal-provider';
import { sendMessagesToLlm } from './services/send-messages-to-llm';
import { getMatchedWordsInString } from './utils/get-matched-targets';

type Chat = {
  role: 'user' | 'model' | 'error';
  message: string;
};

type ChatProps = {
  llmRole: LlmRole;
  initialHistory: Chat[];
};

export function Chat(props: ChatProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Chat[]>(props.initialHistory);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const { setBackgroundImageUrl, setShowBackgroundImage } =
    useScenarioBackground();
  const { scenario, targetWords, setTargetWords } = useScenarioGoal();

  useEffect(() => {
    if (!scenario) return;
    setBackgroundImageUrl(scenario.image_url);
    setShowBackgroundImage(true);
  }, [scenario, setBackgroundImageUrl, setShowBackgroundImage]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;
    if (!inputValue.trim()) return;
    const newUserMessage = inputValue;
    setInputValue('');
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        message: newUserMessage,
      },
    ]);
    sendMessage(messages, newUserMessage);
  }

  function handleRetry() {
    // Remove the last error message and resend the last user message.
    setMessages((prev) => prev.slice(0, -1));
    const historyWithoutLastUserMessage = [...messages].slice(0, -2);
    const lastUserMessage = messages[messages.length - 2];
    sendMessage(historyWithoutLastUserMessage, lastUserMessage.message);
  }

  function sendMessage(history: Chat[], newUserMessage: string) {
    startTransition(async () => {
      const convertedMessages: Content[] = history
        .filter((m) => m.role !== 'error')
        .map((m) => ({ role: m.role, parts: [{ text: m.message }] }));
      try {
        const newModelMessage = await sendMessagesToLlm(
          convertedMessages,
          newUserMessage
        );
        const newModelMessageText = newModelMessage.parts.at(0)?.text;
        if (!newModelMessageText) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'error',
              message: 'An error occurred while sending the message.',
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: 'model', message: newModelMessageText },
          ]);
        }
      } catch (error) {
        console.error(error);
        setMessages((prev) => [
          ...prev,
          {
            role: 'error',
            message: 'An error occurred while sending the message.',
          },
        ]);
      }
    });
  }

  useEffect(() => {
    if (!isPending) {
      inputRef.current?.focus();
    }
  }, [isPending]);

  // We remove the first initial LLM prompt.
  const filteredMessages = [...messages].slice(1);

  // Match target words in AI-generated messages and update the completion status for target words.
  const llmMessage = [...messages]
    .filter((m) => m.role === 'model')
    .map((m) => m.message)
    .join(' ');
  const matchedWords = getMatchedWordsInString(
    llmMessage,
    targetWords.map((word) => word.word)
  );
  const currentlyMatchedTargetWordrs = targetWords
    .filter((word) => word.completed)
    .map((word) => word.word);
  const newMatchedWords = matchedWords.filter(
    (word) => !currentlyMatchedTargetWordrs.includes(word)
  );
  if (newMatchedWords.length > 0) {
    setTargetWords((prev) =>
      prev.map((word) =>
        newMatchedWords.includes(word.word)
          ? { ...word, completed: true }
          : word
      )
    );
  }

  return (
    <>
      <ScrollArea className='flex h-screen w-full px-4'>
        <div className='grid h-full w-full place-items-center py-10'>
          <div className='flex w-full max-w-lg flex-col gap-4 py-10'>
            {filteredMessages.map((message, idx) => (
              <ChatBubble
                key={idx}
                message={message.message}
                isError={message.role === 'error'}
                isUser={message.role === 'user'}
                avatarUrl={
                  message.role === 'user' ? undefined : props.llmRole.avatar_url
                }
                onRetry={handleRetry}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
      <motion.div
        className={cn(
          'fixed bottom-0 z-50 w-full py-4',
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
            ref={inputRef}
            type='text'
            disabled={isPending}
            value={inputValue}
            placeholder='Type a message...'
            onChange={(event) => setInputValue(event.target.value)}
            className='max-w-lg bg-background/40 transition-[box-shadow] duration-300 ease-out focus:shadow-xl'
            autoFocus
          />
        </form>
      </motion.div>
    </>
  );
}
