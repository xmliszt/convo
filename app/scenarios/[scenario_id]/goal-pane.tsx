'use client';

import { Info } from '@phosphor-icons/react';

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
        {goals.map((goal) => (
          <Tooltip key={goal.id}>
            <TooltipTrigger asChild>
              <div className='flex items-start gap-3'>
                <div className='mt-1'>
                  <Info />
                </div>
                <span
                  className={cn(
                    goal.completed ? 'opacity-100' : 'opacity-50',
                    'transition-opacity duration-300 ease-out'
                  )}
                >
                  {goal.short_description}
                </span>
              </div>
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
