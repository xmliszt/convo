'use client';

import { CheckCircle, Circle, Info } from '@phosphor-icons/react';
import { motion, Variants } from 'framer-motion';
import { useEffect } from 'react';

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
import { getMatchedWordsInString } from './utils/get-matched-targets';

export function TargetWordsPane() {
  const { targetWords, history, setTargetWords } = useScenario();

  useEffect(() => {
    if (targetWords.every((word) => word.completed)) return;
    // Match target words in AI-generated messages and update the completion status for target words.
    const llmMessage = [...history]
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
  }, [history, targetWords, setTargetWords]);

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
          {targetWords.map((word, idx) => (
            <motion.div
              key={word.word}
              className={cn(
                'flex items-start gap-3 leading-none [&>svg]:mt-1',
                word.completed && 'text-green-600 [&>span]:line-through'
              )}
              custom={idx}
              initial='initial'
              animate='visible'
              variants={individualTargetWordVariants}
            >
              <motion.span
                custom={0}
                initial='initial'
                animate={word.completed ? 'visible' : 'initial'}
                variants={completionVariants}
              >
                {word.completed ? <CheckCircle /> : <Circle />}
              </motion.span>
              <motion.span
                custom={1}
                initial='initial'
                animate={word.completed ? 'visible' : 'initial'}
                variants={completionVariants}
                className='relative grow leading-tight'
              >
                {word.word}
              </motion.span>
              <div
                className={cn(
                  'pointer-events-none w-10 select-none rounded-[6px] border px-2 text-center text-sm font-bold transition-colors ease-out',
                  word.completed
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
