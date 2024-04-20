'use client';

import { usePathname } from 'next/navigation';

import { CopyToClipboard } from '@/lib/copy-to-clipboard';

export function CopyLinkIcon() {
  const pathname = usePathname();
  const evaluationLink = `Hi! Take a peek at my Convo session results for some awesome situational English conversation practice. Check them out here 🚀:

${window.location.origin}${pathname}`;
  return (
    <CopyToClipboard
      label='Copy to share your results!'
      variant='icon'
      contentToCopy={evaluationLink}
    />
  );
}
