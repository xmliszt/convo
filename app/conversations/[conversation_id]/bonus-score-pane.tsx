'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { useScenario } from './scenario-provider';

export function BonusScorePane() {
  const { goals, targetWords, completedGoalIds, completedWords } =
    useScenario();
  const [animate, setAnimate] = useState(false);
  const currentScore =
    goals
      .filter((goal) => completedGoalIds.includes(goal.id))
      .reduce((acc, goal) => acc + goal.points, 0) +
    targetWords.words
      .filter((word) => completedWords.includes(word))
      .reduce((acc, _) => acc + 1, 0);
  const previousScore = useRef(currentScore);

  useEffect(() => {
    if (previousScore.current !== currentScore) {
      setAnimate((prev) => !prev);
      previousScore.current = currentScore;
    }
  }, [currentScore]);

  if (!goals || !targetWords) return null;

  return (
    <Card
      className='brightness-80 bg-card/20 backdrop-blur-sm'
      style={{
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <CardContent className='p-0 py-1 pl-4 pr-1 text-sm font-light text-foreground opacity-90'>
        <div className='flex w-full items-center justify-between gap-x-2'>
          <div className='grow whitespace-nowrap font-bold'>Your bonus: </div>
          <AnimatePresence>
            <div
              className={cn(
                'relative h-[32px] w-full min-w-[120px] max-w-[120px] overflow-hidden font-sans text-xl font-bold',
                '[&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:text-center',
                'rounded-sm bg-card/20 shadow-[inset_0_0px_5px_1px_#00000020]'
              )}
            >
              {animate ? (
                <motion.span
                  key='currentScore'
                  className='absolute left-0 top-0 z-0 h-full w-full transition-colors'
                  initial={{ y: 30 }}
                  animate={{ y: 0 }}
                  exit={{ y: -30 }}
                >
                  {currentScore.toString().padStart(3, '0')}
                </motion.span>
              ) : (
                <motion.span
                  key='previousScore'
                  className='absolute left-0 top-0 z-0 h-full w-full transition-colors'
                  initial={{ y: 30 }}
                  animate={{ y: 0 }}
                  exit={{ y: -30 }}
                >
                  {currentScore.toString().padStart(3, '0')}
                </motion.span>
              )}
            </div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
