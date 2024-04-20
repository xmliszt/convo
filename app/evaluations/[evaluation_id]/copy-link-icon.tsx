'use client';

import { usePathname } from 'next/navigation';

import { CopyToClipboard } from '@/lib/copy-to-clipboard';

export function CopyLinkIcon() {
  const pathname = usePathname();
  const evaluationLink = `${window.location.origin}${pathname}`;
  return (
    <CopyToClipboard
      label='Copy to share your results!'
      variant='icon'
      contentToCopy={evaluationLink}
    />
  );
}
