'use client';

import { Check, Copy } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type CopyToClipboardProps = {
  contentToCopy: string;
  label: string;
  variant?: 'icon' | 'normal';
};

export function CopyToClipboard(props: CopyToClipboardProps) {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => {
        setHasCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [hasCopied]);

  const handleCopy = useCallback(() => {
    if (navigator.clipboard && !hasCopied) {
      navigator.clipboard
        .writeText(props.contentToCopy)
        .then(() => {
          setHasCopied(true);
          toast.success('Copied!');
        })
        .catch((error) => {
          setHasCopied(false);
          toast.error('Failed to copy!');
          console.error(error);
        });
    }
  }, [props.contentToCopy, hasCopied]);

  // Icon variant
  if (props.variant === 'icon') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <AnimatePresence>
              {hasCopied ? (
                <motion.div
                  className='absolute left-0 top-0 h-full w-full'
                  key='check-button'
                  initial={{ opacity: 0, y: 10, scale: 0 }}
                  animate={{ opacity: 1, y: 10, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0 }}
                >
                  <Check size={36} />
                </motion.div>
              ) : (
                <motion.div
                  key='copy-button'
                  initial={{ opacity: 0, y: 10, scale: 0 }}
                  animate={{ opacity: 1, y: 10, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0 }}
                  onClick={handleCopy}
                  className='absolute left-0 top-0 h-full w-full cursor-pointer'
                >
                  <Copy size={36} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TooltipTrigger>
        <TooltipContent>{props.label}</TooltipContent>
      </Tooltip>
    );
  }
  // Normal variant
  return (
    <Button
      onClick={handleCopy}
      disabled={hasCopied}
      className='relative overflow-hidden'
      style={{
        width: '220px',
        height: '40px',
      }}
    >
      <AnimatePresence>
        {hasCopied ? (
          <motion.div
            key='copied-text-button'
            className='absolute left-0 top-0 flex h-full w-full items-center justify-center gap-x-2'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            <Check />
            <span>Copied to clipboard</span>
          </motion.div>
        ) : (
          <motion.div
            key='copy-text-button'
            className='absolute left-0 top-0 flex h-full w-full items-center justify-center gap-x-2'
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            <Copy />
            <span>{props.label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
