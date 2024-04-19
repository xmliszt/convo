'use client';
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowFatUp } from '@phosphor-icons/react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

type ResponsivePaneDrawerProps = {
  title?: string;
  descriptionclassNam?: string;
  content: React.ReactNode;
  className?: string
};

export function ResponsivePaneDrawer({ 
  title, 
  description, 
  content, 
  className
}: ResponsivePaneDrawerProps) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild className={className}>
        <Button variant="outline" onClick={toggleDrawer}>
          <ArrowFatUp className='size-6'/>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        {title && (
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        )}
        {content}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" onClick={toggleDrawer}>
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}