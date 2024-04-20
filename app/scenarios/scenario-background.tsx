'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

import { useScenarioBackground } from './scenario-background-provider';

export function ScenarioBackground() {
  const { resolvedTheme } = useTheme();
  const { backgroundImageUrl, showBackgroundImage } = useScenarioBackground();

  return (
    <motion.div
      className='fixed inset-0 left-0 top-0 -z-10 h-[120%] w-[120%] [mask:linear-gradient(to_bottom,transparent_0%,black_100%)]'
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter:
          resolvedTheme === 'light'
            ? 'blur(25px) contrast(80%)'
            : 'blur(25px) contrast(100%)',
        WebkitFilter:
          resolvedTheme === 'light'
            ? 'blur(25px) contrast(80%)'
            : 'blur(25px) contrast(100%)',
        WebkitMask: 'linear-gradient(to bottom, transparent 0%, black 100%)',
      }}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: showBackgroundImage ? 1 : 0,
      }}
      exit={{
        opacity: 0,
      }}
    />
  );
}
