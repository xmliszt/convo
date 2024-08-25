import Image from 'next/image';
import { isMobile } from 'react-device-detect';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { ConversationLink } from './conversation-link';

const MAX_DESC_LENGTH = 180;

type ConvversationsCardProps = {
  groupedConversations: Record<
    string,
    (Conversation & {
      scenario: Scenario;
    })[]
  >;
  scenarioIds: string[];
};

export function ConversationsCard(props: ConvversationsCardProps) {
  return (
    <Card className='bg-card/60 shadow-2xl'>
      <CardHeader>
        <CardTitle className='text-3xl font-bold'>Your conversations</CardTitle>
        <CardDescription>
          Here are all the conversations you have created. Click on any one to
          view or resume and resubmit for a new evaluation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {props.scenarioIds.map((scenarioId) => {
            const scenario = props.groupedConversations[scenarioId][0].scenario;
            return (
              <div key={scenarioId} className='group flex flex-col gap-y-2'>
                <div className='flex items-start gap-x-4'>
                  <div className='w-64 overflow-hidden rounded-sm shadow-md'>
                    <AspectRatio ratio={1}>
                      <Image
                        src={scenario.image_url}
                        alt={scenario.name}
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover' }}
                        unoptimized
                        className={cn(
                          'h-full w-full transition-[filter]',
                          isMobile
                            ? 'brightness-100 grayscale-0'
                            : 'brightness-50 grayscale group-hover:brightness-100 group-hover:grayscale-0'
                        )}
                      />
                    </AspectRatio>
                  </div>
                  <div className='space-y-1'>
                    <h3 className='text-lg font-bold'>{scenario.name}</h3>
                    <p className='max-h-[100px] text-xs'>
                      {scenario.description.length > MAX_DESC_LENGTH
                        ? scenario.description.slice(0, MAX_DESC_LENGTH) + '...'
                        : scenario.description}
                    </p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='col-span-2 flex flex-col gap-y-2'>
                    {props.groupedConversations[scenarioId].length > 0 &&
                      props.groupedConversations[scenarioId].map(
                        (conversation, idx) =>
                          conversation !== undefined ? (
                            <ConversationLink
                              key={conversation.id}
                              conversationId={conversation.id}
                              conversationNumber={idx + 1}
                              conversationCreatedAt={conversation.created_at}
                              scenarioImageUrl={scenario.image_url}
                            />
                          ) : null
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
