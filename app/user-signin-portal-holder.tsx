'use client';

import { useSelectedLayoutSegment } from 'next/navigation';

type UserSigninPortalHolderProps = {
  children: React.ReactNode;
};

export function UserSigninPortalHolder(props: UserSigninPortalHolderProps) {
  const segment = useSelectedLayoutSegment();
  const isInConversation = segment === 'conversations';
  if (isInConversation) return null;
  return <div className='fixed right-4 top-4 z-40'>{props.children}</div>;
}
