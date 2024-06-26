'use client';

import { MoonStars, Sun } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  function switchTheme() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }

  return (
    <motion.button
      className='flex size-11 items-center justify-center overflow-hidden rounded-full border bg-[linear-gradient(320deg,#f1f1f1,#ffffff)] shadow-lg dark:bg-[linear-gradient(320deg,#000000,#5a5752)] sm:size-12'
      onClick={() => {
        if (!document.startViewTransition) switchTheme();
        document.startViewTransition(switchTheme);
      }}
      whileHover={{
        scale: 1.1,
      }}
    >
      <div className='flex h-full w-full items-center justify-center overflow-hidden rounded-full shadow-inner'>
        <motion.div
          className='flex items-center gap-12'
          animate={{
            x: resolvedTheme === 'dark' ? 36 : -36,
            transition: {
              type: 'spring',
              duration: 1.2,
              bounce: 0.6,
            },
          }}
        >
          <MoonStars className='size-6' />
          <Sun className='size-6' />
        </motion.div>
        <span className='sr-only'>Toggle theme</span>
      </div>
    </motion.button>
  );
}
