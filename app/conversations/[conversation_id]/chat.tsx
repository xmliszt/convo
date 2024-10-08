'use client';
import 'regenerator-runtime/runtime';

import { PaperPlane, Spinner } from '@phosphor-icons/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { isMobile } from 'react-device-detect';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { toast } from 'sonner';

import { ChatBubble } from '@/components/chat-bubble/chat-bubble';
import { PaneGroupDrawer } from '@/components/pane-group-drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { useScenarioBackground } from '../../scenarios/scenario-background-provider';
import { BonusScorePane } from './bonus-score-pane';
import { GoalPane } from './goal-pane';
import { Microphone } from './microphone';
import type { Chat as ChatType } from './scenario-provider';
import { useScenario } from './scenario-provider';
import { getEvaluationFromAI } from './services/openai/get-evaluation-from-ai';
import { sendMessagesToLlm } from './services/openai/send-messages-to-llm';
import { saveConversationDialog } from './services/save-conversation-dialog';
import { saveEvaluation } from './services/save-evaluation';
import { updateConversation } from './services/update-conversation';
import { TargetWordsPane } from './target-words-pane';
import { MAX_TURNS, TurnsLeftPane } from './turns-left-pane';
import { useMicrophonePermission } from './use-microphone-permission';

type ChatProps = {
  conversationId: string;
  evaluation: Evaluation | null;
  user: UserProfile;
};

export function Chat(props: ChatProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isEvaluating, startEvaluation] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const gameOverButtonRef = useRef<HTMLButtonElement>(null);
  const readonly = !!props.evaluation;

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
    completedGoalIds,
    completedWords,
  } = useScenario();

  useEffect(() => {
    if (props.evaluation) {
      router.prefetch(`/evaluations/${props.evaluation.id}`);
    }
  }, [props.evaluation, router]);

  useEffect(() => {
    if (!scenario) return;
    setBackgroundImageUrl(scenario.image_url);
    setShowBackgroundImage(true);
  }, [scenario, setBackgroundImageUrl, setShowBackgroundImage]);

  // When game over, scroll to the evaluation button.
  useEffect(() => {
    if (isGameOver && gameOverButtonRef.current !== null) {
      gameOverButtonRef.current.scrollIntoView({
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
    saveConversationDialog({
      conversationId: props.conversationId,
      chat: newUserMessage,
    });
  }

  function handleRetry() {
    // Remove the last error message and resend the last user message.
    setHistory((prev) => prev.slice(0, -1));
    const historyWithoutLastUserMessage = [...history].slice(0, -2);
    const lastUserMessage = history[history.length - 2];
    sendMessage(historyWithoutLastUserMessage, lastUserMessage);
  }

  const handleEvaluation = useCallback(() => {
    if (readonly && props.evaluation) {
      router.push(`/evaluations/${props.evaluation.id}`);
      return;
    }
    if (!scenario || !targetWords || !goals || !history) return;
    const bonusScore =
      goals
        .filter((goal) => completedGoalIds.includes(goal.id))
        .reduce((acc, goal) => acc + goal.points, 0) +
      targetWords.words
        .filter((word) => completedWords.includes(word))
        .reduce((acc) => acc + 1, 0);
    startEvaluation(async () => {
      try {
        const { conversation } = await updateConversation({
          conversationId: props.conversationId,
          bonusScore,
        });
        const aiEvaluation = await getEvaluationFromAI({
          scenario,
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
  }, [
    readonly,
    props.evaluation,
    props.conversationId,
    scenario,
    targetWords,
    goals,
    history,
    router,
    completedGoalIds,
    completedWords,
  ]);

  const sendMessage = useCallback(
    async (history: ChatType[], newUserMessage: ChatType) => {
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
          saveConversationDialog({
            conversationId: props.conversationId,
            chat: newModelMessage,
          });
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
    },
    [props.conversationId, setHistory]
  );

  useEffect(() => {
    if (!isSendingMessage) {
      inputRef.current?.focus();
    }
  }, [isSendingMessage]);

  // For STT
  const [isRecording, setIsRecording] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const { isMicrophoneAvailable, isMicrophoneBlockedByExtensions } =
    useMicrophonePermission();

  const pushMessageToBubbleAndSaveIt = useCallback(() => {
    const newUserMessage: ChatType = {
      role: 'user',
      message: transcript,
      createdAt: new Date().toISOString(),
    };
    setInputValue('');
    sendMessage(history.slice(0, -1), newUserMessage);
    saveConversationDialog({
      conversationId: props.conversationId,
      chat: newUserMessage,
    });
  }, [history, props.conversationId, sendMessage, transcript]);

  useEffect(() => {
    if (!listening && transcript.length > 0 && isRecording) {
      setIsRecording(false);
      SpeechRecognition.stopListening();
      pushMessageToBubbleAndSaveIt();
      resetTranscript();
    }
  }, [
    transcript.length,
    isRecording,
    listening,
    pushMessageToBubbleAndSaveIt,
    resetTranscript,
  ]);

  useEffect(() => {
    // Guard: must be recording to run this.
    if (!isRecording) return;
    if (transcript.length > 200) {
      console.warn('Limit 200 exceeded, stop listening.');
      pushMessageToBubbleAndSaveIt();
      setIsRecording(false);
      resetTranscript();
      SpeechRecognition.stopListening();
    }
    const newUserMessage: ChatType = {
      role: 'recording',
      message: transcript,
      createdAt: new Date().toISOString(),
    };
    if (transcript.length > 0) {
      // If the last message is not "recording", we push the new message to the bubble.
      if (history[history.length - 1].role !== 'recording') {
        setHistory((prev) => [...prev, newUserMessage]);
      } else {
        // Otherwise, we replace the last message with the new message.
        setHistory((prev) => [...prev.slice(0, -1), newUserMessage]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

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
              isRecording={message.role === 'recording'}
              avatarUrl={
                message.role === 'user'
                  ? props.user.photo_url === null
                    ? undefined
                    : props.user.photo_url
                  : llmRole?.avatar_url
              }
              gender={llmRole?.gender ?? undefined}
              onRetry={handleRetry}
            />
          ))}
          <AnimatePresence>
            {(isGameOver || hasRunOutofTurn || readonly) && (
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
                      {props.evaluation
                        ? 'View my evaluation results'
                        : 'End the conversation'}
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
          <form onSubmit={handleSubmit} className='grid place-items-center'>
            <div className='relative inline-flex w-full gap-x-2'>
              <Input
                maxLength={200}
                tabIndex={0}
                ref={inputRef}
                type='text'
                disabled={
                  isSendingMessage ||
                  hasRunOutofTurn ||
                  isEvaluating ||
                  readonly ||
                  isRecording
                }
                value={
                  isRecording
                    ? 'Listening... (Speak to the microphone)'
                    : inputValue
                }
                placeholder={
                  hasRunOutofTurn
                    ? 'You have run out of turns'
                    : isRecording
                      ? 'Speak something...'
                      : 'Type a message...'
                }
                onChange={(event) => setInputValue(event.target.value)}
                className={cn(
                  'h-10 w-full transition-[box-shadow_background_color] duration-300 ease-out focus:bg-background/60 focus:shadow-xl',
                  'px-12 lg:pl-4 lg:pr-12',
                  isRecording
                    ? 'bg-destructive/50 font-bold text-white'
                    : 'bg-background/40 font-normal text-primary'
                )}
                autoFocus
              />
              {/* For viewport < lg */}
              <div className='visible absolute left-1 flex h-full items-center lg:invisible '>
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
                  <GoalPane conversationId={props.conversationId} />
                  <TargetWordsPane conversationId={props.conversationId} />
                </PaneGroupDrawer>
              </div>
              <AnimatePresence>
                {inputValue.length === 0 &&
                browserSupportsSpeechRecognition &&
                isMicrophoneAvailable &&
                !isMicrophoneBlockedByExtensions &&
                (window.webkitSpeechRecognition || window.SpeechRecognition) ? (
                  <Microphone
                    disabled={
                      isSendingMessage ||
                      hasRunOutofTurn ||
                      isEvaluating ||
                      readonly
                    }
                    isRecording={isRecording}
                    onStartRecording={() => {
                      console.table({
                        browserSupportsSpeechRecognition,
                        isMicrophoneAvailable,
                        isMicrophoneBlockedByExtensions,
                        inputLength: inputValue.length === 0,
                        webkitSpeechRecognition: window.webkitSpeechRecognition,
                        speechRecognition: window.SpeechRecognition,
                      });
                      if (!isMicrophoneAvailable) return;
                      setIsRecording(true);
                      resetTranscript();
                      SpeechRecognition.startListening();
                    }}
                    onStopRecording={() => {
                      if (!isMicrophoneAvailable) return;
                      setIsRecording(false);
                      SpeechRecognition.stopListening();
                      if (transcript.length > 0) {
                        pushMessageToBubbleAndSaveIt();
                      }
                      resetTranscript();
                    }}
                  />
                ) : (
                  <motion.button
                    type='submit'
                    className='absolute bottom-1 right-1 top-1 grid size-8 place-items-center rounded-sm bg-card/80 p-2'
                    initial='initial'
                    whileHover='hover'
                    disabled={
                      isSendingMessage ||
                      hasRunOutofTurn ||
                      isEvaluating ||
                      readonly
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
