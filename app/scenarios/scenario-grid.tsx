'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { isMobile } from 'react-device-detect';

import { HoverPerspectiveContainer } from '@/components/hover-perspective-container';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

import { useScenarioBackground } from './scenario-background-provider';

type ScenarioGridProps = {
  scenarios: Scenario[];
};

export function ScenarioGrid(props: ScenarioGridProps) {
  const variants: Variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <motion.div
      className='relative grid h-full w-full max-w-xl grid-cols-1 place-items-center gap-8 sm:grid-cols-2'
      initial='initial'
      animate='animate'
      variants={variants}
    >
      {props.scenarios.map((scenario, idx) => (
        <ScenarioCard key={idx} scenario={scenario} />
      ))}
    </motion.div>
  );
}

type ScenarioCardProps = {
  scenario: Scenario;
};

function ScenarioCard(props: ScenarioCardProps) {
  const router = useRouter();
  const { backgroundImageUrl, setBackgroundImageUrl, setShowBackgroundImage } =
    useScenarioBackground();

  const variants: Variants = {
    initial: {
      scale: 1,
      boxShadow: '0 0 0px rgba(0, 0, 0, 0)',
      opacity: 0,
      y: 20,
    },
    animate: {
      scale: 1,
      boxShadow: '0 0 0px rgba(0, 0, 0, 0)',
      opacity: 1,
      y: 0,
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 0 30px rgba(0, 0, 0, 0.1)',
      transition: {
        ease: 'easeOut',
      },
    },
  };

  return (
    <HoverPerspectiveContainer className='border-none shadow-none'>
      <motion.div
        className='group flex h-[450px] max-w-[16rem] cursor-pointer flex-col gap-y-2 rounded-lg border border-primary/10 bg-secondary/10 shadow-inner backdrop-blur-[1px]'
        initial='initial'
        animate='animate'
        whileHover={isMobile ? 'initial' : 'hover'}
        variants={variants}
        onPointerOver={() => {
          if (backgroundImageUrl !== props.scenario.image_url) {
            setBackgroundImageUrl(props.scenario.image_url);
          }
          setShowBackgroundImage(true);
        }}
        onPointerLeave={() => {
          setShowBackgroundImage(false);
        }}
        onClick={() => {
          router.push(`/scenarios/${props.scenario.id}`);
        }}
      >
        <div className='flex h-full w-full flex-col gap-2'>
          <AspectRatio
            ratio={1.5}
            className='overflow-hidden rounded-t-lg transition-[transform_box-shadow_border-radius] ease-in-out group-hover:z-10 group-hover:translate-y-[-20px] group-hover:scale-[1.15] group-hover:rounded-lg group-hover:shadow-2xl'
          >
            <Image
              src={props.scenario.image_url}
              alt={props.scenario.name}
              width={200}
              height={200}
              unoptimized
              className='w-[24rem] max-w-[600px] shadow-inner'
            />
          </AspectRatio>
          <div
            className={cn(
              'flex shrink grow flex-col gap-y-2 rounded-lg px-4 pb-8',
              'bg-[linear-gradient(to_top,#f0f0f080_0%,transparent_100%)]',
              'dark:bg-[linear-gradient(to_top,#22222280_0%,transparent_100%)]'
            )}
          >
            <h1 className='text-center text-lg transition-transform ease-in-out group-hover:translate-y-[-10px] group-hover:scale-[1.05]'>
              {props.scenario.name}
            </h1>
            <p className='text-justify indent-4 text-sm'>
              {props.scenario.description}
            </p>
          </div>
        </div>
      </motion.div>
    </HoverPerspectiveContainer>
  );
}
