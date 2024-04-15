'use client';

import { Content } from '@google/generative-ai';
import { PaperPlane } from '@phosphor-icons/react';
import { motion, Variants } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';

import { ChatBubble } from '@/components/chat-bubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { useScenarioBackground } from '../../scenario-background-provider';
import type { Chat as ChatType } from '../scenario-goal-provider';
import { useScenario } from '../scenario-goal-provider';
import { sendMessagesToLlm } from './services/send-messages-to-llm';

export function Chat() {
  const router = useRouter();
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const gameOverButtonRef = useRef<HTMLButtonElement>(null);

  const { setBackgroundImageUrl, setShowBackgroundImage } =
    useScenarioBackground();
  const { scenario, history, setHistory, isGameOver, llmRole } = useScenario();

  useEffect(() => {
    if (!scenario) return;
    setBackgroundImageUrl(scenario.image_url);
    setShowBackgroundImage(true);
  }, [scenario, setBackgroundImageUrl, setShowBackgroundImage]);

  useEffect(() => {
    if (isGameOver) {
      gameOverButtonRef.current?.focus();
      gameOverButtonRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isGameOver]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSendingMessage) return;
    if (!inputValue.trim()) return;
    const newUserMessage = inputValue;
    setInputValue('');
    setHistory((prev) => [
      ...prev,
      {
        role: 'user',
        message: newUserMessage,
      },
    ]);
    sendMessage(history, newUserMessage);
  }

  function handleRetry() {
    // Remove the last error message and resend the last user message.
    setHistory((prev) => prev.slice(0, -1));
    const historyWithoutLastUserMessage = [...history].slice(0, -2);
    const lastUserMessage = history[history.length - 2];
    sendMessage(historyWithoutLastUserMessage, lastUserMessage.message);
  }

  async function sendMessage(history: ChatType[], newUserMessage: string) {
    const convertedMessages: Content[] = history
      .filter((m) => m.role !== 'error')
      .map((m) => ({ role: m.role, parts: [{ text: m.message }] }));
    try {
      setIsSendingMessage(true);
      const newModelMessage = await sendMessagesToLlm(
        convertedMessages,
        newUserMessage
      );
      const newModelMessageText = newModelMessage.parts.at(0)?.text;
      if (!newModelMessageText) {
        setHistory((prev) => [
          ...prev,
          {
            role: 'error',
            message: 'An error occurred while sending the message.',
          },
        ]);
      } else {
        const newHistory: ChatType[] = [
          ...history,
          { role: 'user', message: newUserMessage },
          { role: 'model', message: newModelMessageText },
        ];
        setHistory(newHistory);
      }
    } catch (error) {
      console.error(error);
      setHistory((prev) => [
        ...prev,
        {
          role: 'error',
          message: 'An error occurred while sending the message.',
        },
      ]);
    } finally {
      setIsSendingMessage(false);
    }
  }

  useEffect(() => {
    if (!isSendingMessage) {
      inputRef.current?.focus();
    }
  }, [isSendingMessage]);

  // We remove the first initial LLM prompt.
  const filteredMessages = [...history].slice(1);

  const sendButtonVariants: Variants = {
    initial: {
      y: 0,
    },
    hover: {
      y: [0, -2, 2, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
      },
    },
  };

  return (
    <>
      <ScrollArea className='absolute left-0 top-0 h-full w-full px-4'>
        <div
          className='mx-auto w-full max-w-lg space-y-4 pb-24 pt-20'
          style={{
            marginTop: isMobile ? '80px' : '0',
          }}
        >
          {filteredMessages.map((message, idx) => (
            <ChatBubble
              key={idx}
              message={message.message}
              isError={message.role === 'error'}
              isUser={message.role === 'user'}
              avatarUrl={
                message.role === 'user' ? undefined : llmRole?.avatar_url
              }
              onRetry={handleRetry}
            />
          ))}
          {isGameOver && (
            <div className='grid w-full  place-items-center'>
              <Button
                ref={gameOverButtonRef}
                className='border-border font-bold hover:border hover:bg-accent/60 hover:shadow-2xl'
                onClick={() => {
                  const evaluationPathname = pathname.replace(
                    'chat',
                    'evaluation'
                  );
                  router.push(evaluationPathname);
                }}
              >
                End the conversation
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
      <motion.div
        className={cn(
          'fixed bottom-0 z-50 w-full py-8',
          // gradient glass effect
          'shadow-inner backdrop-blur-[10px] [mask:linear-gradient(to_top,black_0%,black_75%,transparent_100%)]'
        )}
        style={{
          WebkitBackdropFilter: 'blur(10px)',
          WebkitMask:
            'linear-gradient(to top,black 0%,black 75%,transparent 100%)',
        }}
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
          <div className='relative w-full max-w-lg'>
            <Input
              ref={inputRef}
              type='text'
              disabled={isSendingMessage}
              value={inputValue}
              placeholder='Type a message...'
              onChange={(event) => setInputValue(event.target.value)}
              className='h-10 w-full bg-background/40 pr-10 transition-[box-shadow] duration-300 ease-out focus:shadow-xl'
              autoFocus
            />
            {inputValue.length > 0 && (
              <motion.button
                type='submit'
                className='absolute bottom-1 right-1 top-1 grid size-8 place-items-center rounded-sm bg-card/40 p-2'
                initial='initial'
                whileHover='hover'
                animate={{
                  opacity: 1,
                  y: 0,
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
                <motion.span variants={sendButtonVariants}>
                  <PaperPlane />
                </motion.span>
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>
    </>
  );
}
