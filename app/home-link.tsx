'use client';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AnimatedText } from '@/components/animated-text';

type HomeLinkProps = {
  /**
   * The path to navigate to when the user clicks on this component.
   */
  href: string;
  /**
   * The font size of the heading text as string.
   */
  fontSize?: string;
  /**
   * If true, we show the home link on home page.
   */
  showWhenOnHomePage?: boolean;
};

export function HomeLink(props: HomeLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [headingHeight, setHeadingHeight] = useState(0);
  const [isBeforeRouting, setIsBeforeRouting] = useState(false);

  const containerVairants: Variants = {
    initial: {
      y: 0,
    },
    onHover: {
      y: -headingHeight,
    },
  };

  function handleLinkClick() {
    setIsBeforeRouting(true);
    setTimeout(() => {
      router.push(props.href);
    }, 200);
  }

  useEffect(() => {
    setIsBeforeRouting(false);
  }, [pathname]);

  return (
    <AnimatePresence>
      {!props.showWhenOnHomePage &&
      pathname === '/' ? null : isBeforeRouting ? null : (
        <motion.div
          style={{
            height: headingHeight,
          }}
          className='cursor-pointer overflow-hidden'
          initial={{
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
          }}
          exit={{
            opacity: 0,
            filter: 'blur(20px)',
            scale: 1.5,
          }}
          transition={{
            duration: 0.3,
          }}
          onClick={handleLinkClick}
        >
          {/* Container that holds two rows of text */}
          <motion.div
            initial='initial'
            whileHover='onHover'
            variants={containerVairants}
          >
            <h1
              ref={(heading) => setHeadingHeight(heading?.clientHeight ?? 0)}
              className='h-fit w-full text-center'
              style={{
                fontSize: props.fontSize,
              }}
            >
              <AnimatedText yOffset={20}>Convo</AnimatedText>
            </h1>
            <div
              className='w-full text-center font-bold'
              style={{
                fontSize: props.fontSize,
              }}
            >
              <AnimatedText yOffset={20}>
                {props.href === '/' ? 'Home' : 'Start'}
              </AnimatedText>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
