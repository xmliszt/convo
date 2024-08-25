'use client';

import { ListChecks } from '@phosphor-icons/react';

import { useScenario } from '@/app/conversations/[conversation_id]/scenario-provider';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

type PaneGroupDrawerProps = {
  children: React.ReactNode;
  onDrawerClose?: () => void;
};

export function PaneGroupDrawer(props: PaneGroupDrawerProps) {
  const { scenario } = useScenario();

  return (
    <Drawer onClose={props.onDrawerClose}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger
            asChild
            className='transition-[box-shadow] duration-300 ease-out focus:shadow-xl'
          >
            <Button
              className='grid size-8 place-items-center rounded-sm border border-input bg-background/40 p-1 text-foreground transition-colors'
              variant='ghost'
            >
              <ListChecks size={16} />
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent side='right' sideOffset={4} align='center'>
          Open details and goals
        </TooltipContent>
      </Tooltip>
      <DrawerContent
        className={cn(
          'max-h-[90vh] overflow-hidden rounded-t-2xl bg-[linear-gradient(320deg,#ababab,#ffffff)] px-0 dark:bg-[linear-gradient(320deg,#000000,#292828)]',
          '[&>div:first-child]:absolute [&>div:first-child]:left-1/2 [&>div:first-child]:top-3 [&>div:first-child]:z-50 [&>div:first-child]:mx-auto [&>div:first-child]:h-2 [&>div:first-child]:w-[100px] [&>div:first-child]:translate-x-[-50px] [&>div:first-child]:bg-foreground/60'
        )}
      >
        <div className='relative h-full w-full'>
          <div
            className='absolute left-0 top-[-1px] z-20 h-[65px] w-full bg-background/40 backdrop-blur-[4px] [mask:linear-gradient(black,black,transparent)]'
            style={{
              WebkitBackdropFilter: 'blur(4px)',
              WebkitMask: 'linear-gradient(black,black,transparent)',
            }}
          />
          <div className='h-[90vh] w-full overflow-y-auto px-4 scrollbar-hide'>
            <div className='mx-auto w-full max-w-lg pb-20 pt-[65px]'>
              <DrawerHeader>
                <DrawerTitle>{scenario?.name}</DrawerTitle>
                <DrawerDescription className='text-justify [text-align-last:center]'>
                  {scenario?.description}
                </DrawerDescription>
              </DrawerHeader>

              <div className='flex flex-col gap-y-4'>
                {props.children}
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant='outline'>Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
