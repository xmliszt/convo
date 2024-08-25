'use client';

import { CheckCircle, Circle, Info } from '@phosphor-icons/react';
import { motion, Variants } from 'framer-motion';
import { difference } from 'lodash';
import { useEffect, useTransition } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMediaQuery } from '@/lib/use-media-query';
import { cn } from '@/lib/utils';

import { useScenario } from './scenario-provider';
import { fetchCompletedGoalsAndTargetWords } from './services/fetch-completed-goals';
import { saveCompletedTargetWord } from './services/save-completed-target-word';
import { getMatchedWordsInString } from './utils/get-matched-targets';

type TargetWordsPaneProps = {
  conversationId: string;
};

export function TargetWordsPane(props: TargetWordsPaneProps) {
  const {
    targetWords,
    history,
    setTargetWords,
    completedWords,
    setCompletedWords,
  } = useScenario();

  const [isPending, startTransition] = useTransition();

  // Fetch completed words on mount.
  useEffect(() => {
    startTransition(async () => {
      const { completedTargetWords } = await fetchCompletedGoalsAndTargetWords({
        conversationId: props.conversationId,
      });
      setCompletedWords(completedTargetWords);
    });
  }, [props.conversationId, setCompletedWords]);

  useEffect(() => {
    // If all target words are already completed, return.
    if (targetWords.words.every((word) => completedWords.includes(word)))
      return;

    // Match target words in AI-generated messages and update the completion status for target words.
    const llmMessage = [...history]
      .filter((m) => m.role === 'model')
      .map((m) => m.message)
      .join(' ');
    const allCompletedWordsDetectedInConversation = getMatchedWordsInString(
      llmMessage,
      targetWords.words
    );
    const alreadyCompletedTargetWords = targetWords.words.filter((word) =>
      completedWords.includes(word)
    );
    const newlyCompletedWords = difference(
      allCompletedWordsDetectedInConversation,
      alreadyCompletedTargetWords
    );
    if (newlyCompletedWords.length > 0) {
      // Update DB with the new matched words.
      startTransition(async () => {
        await Promise.all(
          newlyCompletedWords.map(async (completedWord) =>
            saveCompletedTargetWord({
              conversationId: props.conversationId,
              targetWordId: targetWords.id,
              word: completedWord,
            })
          )
        );
      });
      // Update state with the new matched words.
      setCompletedWords((prev) => [...prev, ...newlyCompletedWords]);
    }
  }, [
    history,
    targetWords,
    setTargetWords,
    completedWords,
    props.conversationId,
    setCompletedWords,
  ]);

  const individualTargetWordVariants: Variants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  const completionVariants: Variants = {
    initial: {
      scale: 1,
      opacity: 0.5,
      textDecoration: 'none',
    },
    visible: (i) => ({
      rotate: [0, 3, -3, 5, -5, 3, -3, 0],
      scale: [1, 1.1, 1.1, 1.2, 1.2, 1.1, 1.1, 1],
      opacity: 1,
      textDecoration: 'line-through',
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
        times: [0, 0.1, 0.3, 0.4, 0.6, 0.7, 0.9, 1],
        delay: i * 0.1,
      },
    }),
  };

  const isSmallerDevice = useMediaQuery('(max-width: 1140px)');

  return (
    <Card className='brightness-80 w-full bg-card/20 backdrop-blur-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Target words
          <Popover>
            <PopoverTrigger
              asChild
              hidden={isSmallerDevice}
              className='cursor-pointer'
              disabled={isSmallerDevice}
            >
              <Info />
            </PopoverTrigger>
            <PopoverContent align='start'>
              Try to make AI mention these words in the conversation to earn
              bonus points.
            </PopoverContent>
          </Popover>
        </CardTitle>
        {isSmallerDevice && (
          <CardDescription>
            Try to make AI mention these words in the conversation to earn bonus
            points.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          {targetWords.words.map((word, idx) => (
            <motion.div
              key={word}
              className={cn(
                'flex items-start gap-3 leading-none [&>svg]:mt-1',
                completedWords.includes(word) &&
                  'text-green-600 [&>span]:line-through'
              )}
              custom={idx}
              initial='initial'
              animate='visible'
              variants={individualTargetWordVariants}
            >
              <motion.span
                custom={0}
                initial='initial'
                animate={completedWords.includes(word) ? 'visible' : 'initial'}
                variants={completionVariants}
              >
                {completedWords.includes(word) ? <CheckCircle /> : <Circle />}
              </motion.span>
              <motion.span
                custom={1}
                initial='initial'
                animate={completedWords.includes(word) ? 'visible' : 'initial'}
                variants={completionVariants}
                className='relative grow leading-tight'
              >
                {word}
              </motion.span>
              <div
                className={cn(
                  'pointer-events-none w-10 select-none rounded-[6px] border px-2 text-center text-sm font-bold transition-colors ease-out',
                  completedWords.includes(word)
                    ? 'border-green-600 bg-green-600/10 text-green-700'
                    : 'border-border bg-background/30 text-primary/50'
                )}
              >
                +1
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
