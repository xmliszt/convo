'use client';

import { PaperPlane, Spinner } from '@phosphor-icons/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { isMobile } from 'react-device-detect';
import { toast } from 'sonner';

import { ChatBubble } from '@/components/chat-bubble';
import { PaneGroupDrawer } from '@/components/pane-group-drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { useScenarioBackground } from '../scenario-background-provider';
import { BonusScorePane } from './bonus-score-pane';
import { GoalPane } from './goal-pane';
import type { Chat as ChatType } from './scenario-provider';
import { useScenario } from './scenario-provider';
import { getEvaluationFromAI } from './services/openai/get-evaluation-from-ai';
import { sendMessagesToLlm } from './services/openai/send-messages-to-llm';
import { saveConversation } from './services/save-conversation';
import { saveEvaluation } from './services/save-evaluation';
import { TargetWordsPane } from './target-words-pane';
import { MAX_TURNS, TurnsLeftPane } from './turns-left-pane';

export function Chat() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isEvaluating, startEvaluation] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const gameOverButtonRef = useRef<HTMLButtonElement>(null);

  const { setBackgroundImageUrl, setShowBackgroundImage } =
    useScenarioBackground();
  const {
    scenario,
    history,
    targetWords,
    goals,
    setHistory,
    isGameOver,
    llmRole,
  } = useScenario();

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
    const newUserMessage: ChatType = {
      role: 'user',
      message: inputValue,
      createdAt: new Date().toISOString(),
    };
    setInputValue('');
    setHistory((prev) => [...prev, newUserMessage]);
    sendMessage(history, newUserMessage);
  }

  function handleRetry() {
    // Remove the last error message and resend the last user message.
    setHistory((prev) => prev.slice(0, -1));
    const historyWithoutLastUserMessage = [...history].slice(0, -2);
    const lastUserMessage = history[history.length - 2];
    sendMessage(historyWithoutLastUserMessage, lastUserMessage);
  }

  const handleEvaluation = useCallback(() => {
    if (!scenario || !targetWords || !goals || !history) return;
    const bonusScore =
      goals
        .filter((goal) => goal.completed)
        .reduce((acc, goal) => acc + goal.points, 0) +
      targetWords
        .filter((targetWord) => targetWord.completed)
        .reduce((acc) => acc + 1, 0);
    startEvaluation(async () => {
      try {
        const { conversation } = await saveConversation({
          scenarioId: scenario.id,
          conversation: history,
          bonusScore,
        });
        const aiEvaluation = await getEvaluationFromAI({
          scenario,
          targetWords,
          goals,
          history: history.slice(1), //  Remove first system message
        });
        const savedEvaluation = await saveEvaluation({
          conversationId: conversation.id,
          evaluation: aiEvaluation.evaluation,
          score: aiEvaluation.score,
          suggestions: aiEvaluation.suggestions,
        });
        router.push(`/evaluations/${savedEvaluation.evaluation.id}`);
      } catch (error) {
        console.error(error);
        toast.error(
          'An error occurred while evaluating the performance. Please try again.'
        );
      }
    });
  }, [goals, history, scenario, targetWords, router]);

  async function sendMessage(history: ChatType[], newUserMessage: ChatType) {
    const convertedMessages: ChatType[] = history.filter(
      (m) => m.role !== 'error'
    );
    try {
      setIsSendingMessage(true);
      const newModelMessage = await sendMessagesToLlm(
        convertedMessages,
        newUserMessage.message
      );
      if (!newModelMessage.message) {
        setHistory((prev) => [
          ...prev,
          {
            role: 'error',
            message: 'An unknown error occurred while sending the message.',
            createdAt: new Date().toISOString(),
          },
        ]);
      } else {
        const newHistory: ChatType[] = [
          ...history,
          newUserMessage,
          newModelMessage,
        ];
        setHistory(newHistory);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : undefined;
      setHistory((prev) => [
        ...prev,
        {
          role: 'error',
          message:
            'An error occurred while sending the message.' + errorMessage
              ? ` Error: ${errorMessage}`
              : '',
          createdAt: new Date().toISOString(),
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

  if (!scenario) return null;

  const hasRunOutofTurn =
    history.slice(1).filter((chat) => chat.role === 'user').length >= MAX_TURNS;

  return (
    <>
      <ScrollArea className='absolute left-0 top-0 z-0 h-full w-full px-4'>
        <div
          className='mx-auto w-full max-w-lg space-y-4 pb-32 pt-20'
          style={{
            marginTop: isMobile ? '60px' : '0',
          }}
        >
          {filteredMessages.map((message, idx) => (
            <ChatBubble
              key={idx}
              id={`chat-bubble-${idx}`}
              message={message.message}
              isError={message.role === 'error'}
              isUser={message.role === 'user'}
              avatarUrl={
                message.role === 'user' ? undefined : llmRole?.avatar_url
              }
              onRetry={handleRetry}
            />
          ))}
          <AnimatePresence>
            {(isGameOver || hasRunOutofTurn) && (
              <motion.div
                key='game-over-button'
                className='grid w-full place-items-center'
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
                  ref={gameOverButtonRef}
                  className='border-border font-bold hover:border hover:bg-accent/60 hover:text-primary hover:shadow-2xl'
                  onClick={handleEvaluation}
                  disabled={isEvaluating}
                >
                  {isEvaluating ? (
                    <motion.span
                      key={'button-evaluating'}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      className='flex items-center gap-x-2'
                    >
                      <Spinner className='animate-spin' />
                      Evaluating performance...
                    </motion.span>
                  ) : (
                    <motion.span
                      key={'button-idle'}
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                    >
                      End the conversation
                    </motion.span>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
      <motion.div
        className={cn(
          'fixed bottom-0 left-0 z-20 flex w-full justify-center py-8',
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
        <div className='flex max-w-lg grow flex-col justify-start gap-2 px-4'>
          {/* For viewport < lg */}
          <div className='visible lg:invisible'>
            <PaneGroupDrawer
              onDrawerClose={() => {
                const lastChatBubbleIndex = filteredMessages.length - 1;
                const lastChatBubble = document.getElementById(
                  `chat-bubble-${lastChatBubbleIndex}`
                );
                setTimeout(() => {
                  lastChatBubble?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }, 500);
              }}
            >
              <BonusScorePane />
              <TurnsLeftPane />
              <GoalPane />
              <TargetWordsPane />
            </PaneGroupDrawer>
          </div>
          <form onSubmit={handleSubmit} className='grid place-items-center'>
            <div className='relative inline-flex w-full gap-x-2'>
              <Input
                maxLength={200}
                tabIndex={0}
                ref={inputRef}
                type='text'
                disabled={isSendingMessage || hasRunOutofTurn || isEvaluating}
                value={inputValue}
                placeholder={
                  hasRunOutofTurn
                    ? 'You have run out of turns'
                    : 'Type a message...'
                }
                onChange={(event) => setInputValue(event.target.value)}
                className='h-10 w-full bg-background/40 pr-10 transition-[box-shadow_background] duration-300 ease-out focus:bg-background/60 focus:shadow-xl'
                autoFocus
              />
              <AnimatePresence>
                {inputValue.length > 0 && (
                  <motion.button
                    type='submit'
                    className='absolute bottom-1 right-1 top-1 grid size-8 place-items-center rounded-sm bg-card/80 p-2'
                    initial='initial'
                    whileHover='hover'
                    disabled={
                      isSendingMessage || hasRunOutofTurn || isEvaluating
                    }
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
                    <motion.span variants={sendButtonVariants}>
                      <PaperPlane />
                    </motion.span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
        <div />
      </motion.div>
    </>
  );
}
