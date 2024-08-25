'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';

import { useMediaQuery } from '@/lib/use-media-query';

import { useScenarioBackground } from '../scenarios/scenario-background-provider';

type ConversationLinkProps = {
  conversationId: string;
  conversationNumber: number;
  conversationCreatedAt: string;
  scenarioImageUrl: string;
};

export function ConversationLink(props: ConversationLinkProps) {
  const { setBackgroundImageUrl, setShowBackgroundImage } =
    useScenarioBackground();

  const isSmallerDevice = useMediaQuery('(max-width: 640px)');

  if (props.conversationId === undefined) return null;

  return (
    <Link
      href={`/conversations/${props.conversationId}`}
      className='flex items-center justify-between rounded-sm border p-2 transition-[transform_box-shadow_background] hover:scale-105 hover:bg-card hover:shadow-lg'
      onPointerOver={() => {
        if (isMobile) return;
        setBackgroundImageUrl(props.scenarioImageUrl);
        setShowBackgroundImage(true);
      }}
      onPointerOut={() => {
        if (isMobile) return;
        setShowBackgroundImage(false);
      }}
    >
      Conversation {props.conversationNumber.toString().padStart(2, '0')}
      <div>
        {format(
          new Date(props.conversationCreatedAt),
          isSmallerDevice ? 'EEE, dd MMM yyyy HH:mm' : 'EEEE, dd MMM yyyy HH:mm'
        )}
      </div>
    </Link>
  );
}
