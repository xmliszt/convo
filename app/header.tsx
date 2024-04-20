'use client';

import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from 'next/navigation';

import { cn } from '@/lib/utils';

import { DEFAULT_HOMELINK, HomeLink } from './home-link';

const LAYOUT_SEGMENT_TO_LINK: Record<string, HomeLink> = {
  '/': {
    href: '/scenarios',
    label: 'Start',
  },
  scenarios: {
    href: '/',
    label: 'Home',
  },
  'scenarios/*': {
    href: '/scenarios',
    label: 'Scenarios',
  },
  'evaluations/*': {
    href: '/scenarios',
    label: 'Scenarios',
  },
};

export function Header() {
  const layoutSegment = useSelectedLayoutSegment();
  const segments = useSelectedLayoutSegments();
  const isRootLayout =
    layoutSegment === null ||
    segments.length === 1 ||
    (segments.length > 1 &&
      segments.indexOf(layoutSegment) === segments.length - 1);

  const segmentKey =
    layoutSegment === null
      ? '/'
      : isRootLayout
        ? layoutSegment
        : `${layoutSegment}/*`;

  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-50 flex w-screen items-center bg-background/60',
        // gradient glass effect
        'shadow-inner backdrop-blur-[5px] [mask:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)]'
      )}
      style={{
        WebkitBackdropFilter: 'blur(5px)',
        WebkitMask:
          'linear-gradient(to bottom,black 0%,black 50%,transparent 100%)',
      }}
    >
      <div className='px-4 py-2'>
        <HomeLink
          homeLink={LAYOUT_SEGMENT_TO_LINK[segmentKey] ?? DEFAULT_HOMELINK}
          fontSize='24px'
        />
      </div>
    </div>
  );
}
