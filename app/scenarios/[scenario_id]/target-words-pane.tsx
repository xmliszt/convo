'use client';

import { CheckCircle, Circle, Info } from '@phosphor-icons/react';
import { motion, Variants } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { useScenarioGoal } from './scenario-goal-provider';

export function TargetWordsPane() {
  const { targetWords } = useScenarioGoal();

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
    },
    visible: (i) => ({
      rotate: [0, 3, -3, 5, -5, 3, -3, 0],
      scale: [1, 1.1, 1.1, 1.2, 1.2, 1.1, 1.1, 1],
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
        times: [0, 0.1, 0.3, 0.4, 0.6, 0.7, 0.9, 1],
        delay: i * 0.1,
      },
    }),
  };

  return (
    <Card className='brightness-80 w-full bg-card/20 backdrop-blur-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Target words
          <Tooltip>
            <TooltipTrigger asChild>
              <Info />
            </TooltipTrigger>
            <TooltipContent align='start'>
              Try to make AI mention these words in the conversation for some
              bonus points!
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          {targetWords.map((word, idx) => (
            <motion.div
              key={word.word}
              className={cn(
                'flex items-center gap-3 leading-none [&>svg]:mt-1',
                word.completed && 'text-green-600'
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
              >
                {word.word}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
