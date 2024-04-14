'use client';

import { Circle, UserCircleCheck } from '@phosphor-icons/react';
import { motion, Variants } from 'framer-motion';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    },
    visible: (i) => ({
      rotate: [0, 3, -3, 5, -5, 3, -3, 0],
      scale: [1, 1.1, 1.1, 1.2, 1.2, 1.1, 1.1, 1],
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
        times: [0, 0.1, 0.3, 0.4, 0.6, 0.7, 0.9, 1],
        delay: i * 0.1,
      },
    }),
  };

  return (
    <Card
      className={cn(
        'absolute left-[calc(50vw-32rem)] top-[80px] max-w-[14rem]',
        'brightness-80 bg-card/20 backdrop-blur-sm',
        'hidden lg:block'
      )}
    >
      <CardHeader>
        <CardTitle>Target words</CardTitle>
        <CardDescription className='text-sm'>
          These are the words you should try to make the AI say. Bonus points
          will be awarded for each word you manage to get the AI to say.
        </CardDescription>
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
                {word.completed ? <UserCircleCheck /> : <Circle />}
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
