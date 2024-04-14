'use client';

import { Info } from '@phosphor-icons/react';
import { motion, Variants } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { useScenarioGoal } from './scenario-goal-provider';

export function GoalPane() {
  const { scenario, goals } = useScenarioGoal();
  if (!scenario) return null;

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

  return (
    <Card className='brightness-80 w-full bg-card/20 backdrop-blur-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Goals
          <Tooltip>
            <TooltipTrigger asChild>
              <Info />
            </TooltipTrigger>
            <TooltipContent align='start'>
              Main goals of this scenario. Try to achieve them by mentioning in
              your conversation.
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        {goals.map((goal, idx) => (
          <Tooltip key={goal.id}>
            <TooltipTrigger asChild>
              <motion.div
                className={cn(
                  'flex items-start gap-3',
                  goal.completed && 'text-green-600 line-through'
                )}
                custom={idx}
                initial='initial'
                animate='visible'
                variants={individualTargetWordVariants}
              >
                <motion.span
                  className='mt-1'
                  custom={0}
                  initial='initial'
                  animate={goal.completed ? 'visible' : 'initial'}
                  variants={completionVariants}
                >
                  <Info />
                </motion.span>
                <motion.span
                  custom={0}
                  initial='initial'
                  animate={goal.completed ? 'visible' : 'initial'}
                  variants={completionVariants}
                >
                  {goal.short_description}
                </motion.span>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent align='start' side='left'>
              {goal.long_description}
            </TooltipContent>
          </Tooltip>
        ))}
      </CardContent>
    </Card>
  );
}
