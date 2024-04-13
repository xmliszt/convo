'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { isMobile } from 'react-device-detect';

import { HoverPerspectiveContainer } from '@/components/hover-perspective-container';

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
        className='group flex cursor-pointer flex-col gap-y-2 rounded-lg border border-primary/10 bg-secondary/10 shadow-inner backdrop-blur-[1px]'
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
        <Image
          src={props.scenario.image_url}
          alt={props.scenario.name}
          width={200}
          height={200}
          unoptimized
          layout='responsive'
          className='relative rounded-t-lg shadow-inner transition-[transform_box-shadow_border-radius] ease-in-out group-hover:z-10 group-hover:translate-y-[-20px] group-hover:scale-[1.15] group-hover:rounded-lg group-hover:shadow-2xl'
        />
        <div className='flex flex-col gap-y-2 px-4 pb-4'>
          <h1 className='text-center text-xl transition-transform ease-in-out group-hover:translate-y-[-10px] group-hover:scale-[1.05]'>
            {props.scenario.name}
          </h1>
          <p className='text-sm'>{props.scenario.description}</p>
        </div>
      </motion.div>
    </HoverPerspectiveContainer>
  );
}
