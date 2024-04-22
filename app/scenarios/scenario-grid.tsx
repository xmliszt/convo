'use client';

import { Spinner } from '@phosphor-icons/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { isMobile } from 'react-device-detect';
import { toast } from 'sonner';

import { HoverPerspectiveContainer } from '@/components/hover-perspective-container';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

import { useScenarioBackground } from './scenario-background-provider';
import { createConversation } from './services/create-conversation';

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
      className='relative flex h-full w-full max-w-[40rem] flex-col items-center gap-8 sm:grid sm:grid-cols-2'
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
  const { backgroundImageUrl, setBackgroundImageUrl, setShowBackgroundImage } =
    useScenarioBackground();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

  const handleCreateConversation = useCallback(() => {
    if (isPending) return;
    startTransition(async () => {
      try {
        const { conversation } = await createConversation({
          scenarioId: props.scenario.id,
        });
        router.push(`/conversations/${conversation.id}`);
      } catch (error) {
        console.error(error);
        toast.error('Unable to create conversation.');
      }
    });
  }, [props.scenario.id, router, isPending]);

  return (
    <div
      className={cn(
        'w-fit sm:place-self-stretch',
        isPending ? 'cursor-progress' : 'cursor-pointer'
      )}
      onClick={() => {
        if (isPending) return;
        handleCreateConversation();
      }}
    >
      <HoverPerspectiveContainer className='z-0 h-full w-fit border-none shadow-none hover:z-50'>
        <AnimatePresence>
          <motion.div
            className={cn(
              'group relative flex h-full max-w-[20rem] flex-col gap-y-2 rounded-lg border border-primary/10 bg-secondary/10 shadow-inner backdrop-blur-[4px]'
            )}
            style={{
              WebkitBackdropFilter: 'blur(4px)',
              WebkitBoxShadow:
                'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
            }}
            initial='initial'
            animate='animate'
            whileHover='hover'
            variants={variants}
            onPointerOver={() => {
              if (isMobile) return;
              if (backgroundImageUrl !== props.scenario.image_url) {
                setBackgroundImageUrl(props.scenario.image_url);
              }
              setShowBackgroundImage(true);
            }}
            onPointerLeave={() => {
              if (isMobile) return;
              setShowBackgroundImage(false);
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
                  'flex w-[20rem] shrink grow flex-col gap-y-2 rounded-lg px-4 pb-8',
                  'bg-[linear-gradient(to_top,#f0f0f080_0%,transparent_100%)]',
                  'dark:bg-[linear-gradient(to_top,#22222280_0%,transparent_100%)]'
                )}
              >
                <h1 className='mb-4 h-12 text-center text-lg transition-transform ease-in-out group-hover:translate-y-[-10px] group-hover:scale-[1.05]'>
                  {isPending ? 'Creating conversation...' : props.scenario.name}
                </h1>
                {isPending ? (
                  <Spinner className='m-auto animate-spin' />
                ) : (
                  <p className='text-justify indent-4 text-sm'>
                    {props.scenario.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </HoverPerspectiveContainer>
    </div>
  );
}
