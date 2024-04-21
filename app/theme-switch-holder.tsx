'use client';

import { useSelectedLayoutSegment } from 'next/navigation';

import { ThemeSwitch } from '@/components/theme-switch';
import { cn } from '@/lib/utils';

export function ThemeSwitchHolder() {
  const segment = useSelectedLayoutSegment();
  const isInConversation = segment === 'conversations';
  return (
    <div
      className={cn(
        'fixed z-40',
        isInConversation ? 'right-4 top-4' : 'bottom-8 right-6'
      )}
    >
      <ThemeSwitch />
    </div>
  );
}
