'use client';

import { motion } from 'framer-motion';

import { useScenarioBackground } from './scenario-background-provider';

export function ScenarioBackground() {
  const { backgroundImageUrl, showBackgroundImage } = useScenarioBackground();

  return (
    <motion.div
      className='fixed inset-0 left-0 top-0 -z-10 h-[120%] w-[120%] opacity-35 [mask:linear-gradient(to_bottom,transparent_0%,black_100%)]'
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'blur(20px) brightness(0.8)',
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
