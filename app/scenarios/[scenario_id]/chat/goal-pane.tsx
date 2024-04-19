'use client';

import { ArrowClockwise, Info } from '@phosphor-icons/react';
import { motion, Variants } from 'framer-motion';
import { useCallback, useEffect, useRef, useTransition } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { Chat, useScenario } from '../scenario-goal-provider';
import { checkGoalCompletions } from './services/check-goal-completions';

export function GoalPane() {
  const { scenario, goals, setGoals, history } = useScenario();
  const [isPending, startTransition] = useTransition();

  const checkGoals = useCallback(
    (history: Chat[]) => {
      // Start transition so it does not block UI.
      startTransition(async () => {
        if (scenario) {
          try {
            const completedGoalIds = await checkGoalCompletions({
              goals: goals,
              completedGoalIds: goals
                .filter((goal) => goal.completed)
                .map((g) => g.id),
              history: history
                .filter(
                  (message) =>
                    message.role === 'user' || message.role === 'model'
                )
                .map((message) => ({
                  role: message.role,
                  parts: [{ text: message.message }],
                })),
              scenario: scenario,
            });
            if (completedGoalIds.length > 0) {
              setGoals((prev) =>
                prev.map((goal) => ({
                  ...goal,
                  completed: completedGoalIds.includes(goal.id),
                }))
              );
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    },
    [goals, scenario, setGoals]
  );

  const previousHistory = useRef<Chat[]>([]);

  useEffect(() => {
    if (history.length <= 2) return;
    if (history.length === previousHistory.current.length) return;
    if (goals.every((goal) => goal.completed)) return;
    checkGoals(history);
    previousHistory.current = history;
  }, [goals, history, checkGoals]);

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
      <CardContent className='relative flex flex-col gap-4'>
        {goals.map((goal, idx) => (
          <Tooltip key={goal.id}>
            <TooltipTrigger asChild>
              <motion.div
                className={cn(
                  'relative flex items-start gap-3',
                  goal.completed && 'text-green-600 [&>span]:line-through'
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
                  custom={1}
                  initial='initial'
                  animate={goal.completed ? 'visible' : 'initial'}
                  variants={completionVariants}
                >
                  {goal.short_description}
                </motion.span>
                <div
                  className={cn(
                    'pointer-events-none w-10 select-none rounded-[6px] border px-2 text-center text-sm font-bold transition-colors ease-out',
                    goal.completed
                      ? 'border-green-600 bg-green-600/10 text-green-700'
                      : 'border-border bg-background/30 text-primary/50'
                  )}
                >
                  +{goal.points}
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent align='start' side='left'>
              {goal.long_description}
            </TooltipContent>
          </Tooltip>
        ))}
        <div className='absolute bottom-4 right-4 z-10 size-4'>
          <ArrowClockwise
            className={cn(
              isPending
                ? 'animate-spin text-primary'
                : 'animate-none text-primary/20',
              'transition-[opacity_color]'
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
