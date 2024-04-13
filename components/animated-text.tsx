'use client';

import { motion } from 'framer-motion';

type AnimatedTextProps = {
  yOffset?: number;
  children: string;
};

export function AnimatedText(props: AnimatedTextProps) {
  const variants = {
    hidden: {
      opacity: 0,
      y: props.yOffset ?? 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        type: 'spring',
        bounce: 0.5,
      },
    },
  };

  return (
    <motion.span
      className='h-fit whitespace-nowrap'
      initial='hidden'
      animate='visible'
      transition={{
        staggerChildren: 0.05,
      }}
    >
      {props.children.split(' ').map((word, index) => (
        <span key={index} className='inline-block'>
          {splitTextUsingRegex(word).map((character, index) => (
            <motion.span
              key={index}
              className='inline-block'
              variants={variants}
            >
              {character}
            </motion.span>
          ))}
          <span>&nbsp;</span>
        </span>
      ))}
    </motion.span>
  );
}

function splitTextUsingRegex(text: string) {
  const regex = /[\s\S]/gu;
  const characters = [];

  let match;
  while ((match = regex.exec(text))) {
    characters.push(match[0]);
  }
  return characters;
}
