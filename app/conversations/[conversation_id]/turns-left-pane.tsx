'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { useScenario } from './scenario-provider';

export const MAX_TURNS = 20;

export function TurnsLeftPane() {
  const { history } = useScenario();
  const [animate, setAnimate] = useState(false);
  const currentTurnCountLeft =
    MAX_TURNS - history.slice(1).filter((chat) => chat.role === 'user').length;
  const previousTurnCountLeft = useRef(currentTurnCountLeft);

  useEffect(() => {
    if (previousTurnCountLeft.current !== currentTurnCountLeft) {
      setAnimate((prev) => !prev);
      previousTurnCountLeft.current = currentTurnCountLeft;
    }
  }, [currentTurnCountLeft]);

  if (!history) return null;

  return (
    <Card
      className='brightness-80 bg-card/20 backdrop-blur-sm'
      style={{
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <CardContent className='p-0 py-1 pl-4 pr-1 text-sm font-light text-foreground opacity-90'>
        <div className='flex w-full items-center justify-between gap-x-2'>
          <div className='grow whitespace-nowrap font-bold'>Turns left: </div>
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
                  className={cn(
                    'absolute left-0 top-0 z-0 h-full w-full transition-colors',
                    currentTurnCountLeft > 0 &&
                      currentTurnCountLeft <= 5 &&
                      'text-orange-400',
                    currentTurnCountLeft === 0 && 'text-red-600'
                  )}
                  initial={{ y: 30 }}
                  animate={{ y: 0 }}
                  exit={{ y: -30 }}
                >
                  {currentTurnCountLeft.toString().padStart(3, '0')}
                </motion.span>
              ) : (
                <motion.span
                  key='previousScore'
                  className={cn(
                    'absolute left-0 top-0 z-0 h-full w-full transition-colors',
                    currentTurnCountLeft > 0 &&
                      currentTurnCountLeft <= 5 &&
                      'text-orange-400',
                    currentTurnCountLeft === 0 && 'text-red-600'
                  )}
                  initial={{ y: 30 }}
                  animate={{ y: 0 }}
                  exit={{ y: -30 }}
                >
                  {currentTurnCountLeft.toString().padStart(3, '0')}
                </motion.span>
              )}
            </div>
          </AnimatePresence>
        </div>
        {currentTurnCountLeft === 0 && (
          <motion.div
            className='mt-2 font-semibold text-red-600'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            <p>You have run out of your turns ö</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
