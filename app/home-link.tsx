'use client';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { AnimatedText } from '@/components/animated-text';

export type HomeLink = {
  /**
   * The path to navigate to when the user clicks on this component.
   */
  href: string;
  /**
   * The label to show on the home link.
   */
  label: string;
};

export const DEFAULT_HOMELINK: HomeLink = {
  href: '/',
  label: 'Home',
};

type HomeLinkProps = {
  /**
   * The {@link HomeLink} object that contains the path and label for the home link.
   */
  homeLink: HomeLink;
  /**
   * The font size of the heading text as string.
   */
  fontSize?: string;
  /**
   * If true, we show the home link on home page.
   */
  showWhenOnHomePage?: boolean;
  /**
   * Maintenance mode
   */
  maintenanceMode?: boolean;
};

export function HomeLink(props: HomeLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [headingHeight, setHeadingHeight] = useState(0);
  const [isBeforeRouting, setIsBeforeRouting] = useState(false);

  useEffect(() => {
    // Listen to viewport change
    function handleViewportChange() {
      const headingElement = document.getElementById('home-link-heading');
      if (headingElement) {
        setHeadingHeight(headingElement.clientHeight);
      }
    }
    window.addEventListener('resize', handleViewportChange);
    return () => {
      window.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  const containerVairants: Variants = {
    initial: {
      y: 0,
    },
    onHover: (height) => ({
      y: -height,
    }),
  };

  const handleLinkClick = useCallback(() => {
    if (props.maintenanceMode) return;
    setIsBeforeRouting(true);
    setTimeout(() => {
      router.push(props.homeLink.href);
    }, 200);
  }, [props.homeLink.href, props.maintenanceMode, router]);

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
            custom={headingHeight}
            initial='initial'
            whileHover='onHover'
            variants={containerVairants}
          >
            <h1
              id='home-link-heading'
              ref={(el) => {
                if (el) {
                  setHeadingHeight(el.clientHeight);
                }
              }}
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
                {props.maintenanceMode
                  ? '...will be back soon!'
                  : props.homeLink.label}
              </AnimatedText>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
