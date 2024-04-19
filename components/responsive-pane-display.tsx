'use client';
import { ArrowFatUp } from '@phosphor-icons/react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

type PaneGroupDrawerProps = {
  title: string;
  children: React.ReactNode;
};

export function PaneGroupDrawer(props: PaneGroupDrawerProps) {
  const [open, setOpen] = React.useState(false);

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
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{props.title}</DrawerTitle>
        </DrawerHeader>
        {props.children}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='outline' onClick={toggleDrawer}>
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
