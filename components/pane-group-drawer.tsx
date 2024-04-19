'use client';

import { ArrowFatUp } from '@phosphor-icons/react';
import { useState } from 'react';

import { useScenario } from '@/app/scenarios/[scenario_id]/scenario-goal-provider';
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

import { ScrollArea } from './ui/scroll-area';

type PaneGroupDrawerProps = {
  children: React.ReactNode;
};

export function PaneGroupDrawer(props: PaneGroupDrawerProps) {
  const { scenario } = useScenario();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        asChild
        className='block h-10 bg-background/40 transition-[box-shadow] duration-300 ease-out focus:shadow-xl lg:hidden'
      >
        <Button variant='outline' onClick={toggleDrawer}>
          <ArrowFatUp className='size-6' />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='max-h-screen bg-[linear-gradient(145deg,#f1f1f1,#ffffff)] px-4 dark:bg-[linear-gradient(145deg,#000000,#292828)]'>
        <DrawerHeader>
          <DrawerTitle>{scenario?.name}</DrawerTitle>
          <DrawerDescription>{scenario?.description}</DrawerDescription>
        </DrawerHeader>

        <ScrollArea>
          <div className='flex flex-col gap-y-4'>
            {props.children}
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant='outline' onClick={toggleDrawer}>
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
