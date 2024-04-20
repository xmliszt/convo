'use client';

import { CursorClick, Fingerprint } from '@phosphor-icons/react';
import { isMobile } from 'react-device-detect';

import { useScenario } from '@/app/scenarios/[scenario_id]/scenario-provider';
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

type PaneGroupDrawerProps = {
  children: React.ReactNode;
};

export function PaneGroupDrawer(props: PaneGroupDrawerProps) {
  const { scenario } = useScenario();

  return (
    <Drawer>
      <DrawerTrigger
        asChild
        className='transition-[box-shadow] duration-300 ease-out focus:shadow-xl'
      >
        <Button
          className='flex h-8 items-center gap-x-1 rounded-full border border-input bg-background/40 px-3 py-1 transition-colors'
          variant='ghost'
        >
          {isMobile ? <Fingerprint /> : <CursorClick />}
          <span className='text-xs'>
            {isMobile ? 'Tap' : 'Click'} to view details
          </span>
        </Button>
      </DrawerTrigger>
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
