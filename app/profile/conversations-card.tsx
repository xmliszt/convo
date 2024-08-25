import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
        <CardTitle>
          <h2 className='text-3xl font-bold'>Your conversations</h2>
        </CardTitle>
        <CardDescription>
          <p>
            Here are all the conversations you have created. Click on any one to
            view or resume and resubmit for a new evaluation.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {props.scenarioIds.map((scenarioId) => {
            const scenario = props.groupedConversations[scenarioId][0].scenario;
            return (
              <div key={scenarioId} className='group'>
                <div className='grid grid-cols-[100px_auto] gap-4'>
                  <div className='h-full min-h-[100px] w-[100px] overflow-hidden rounded-sm shadow-md'>
                    <Image
                      src={scenario.image_url}
                      alt={scenario.name}
                      width={100}
                      height={100}
                      style={{
                        objectFit: 'cover',
                      }}
                      unoptimized
                      className='h-full w-full brightness-50 grayscale transition-[filter] group-hover:brightness-100 group-hover:grayscale-0'
                    />
                  </div>
                  <div className='w-full space-y-1'>
                    <h3 className='text-lg font-bold'>{scenario.name}</h3>
                    <p className='max-h-[100px] text-xs'>
                      {scenario.description.length > MAX_DESC_LENGTH
                        ? scenario.description.slice(0, MAX_DESC_LENGTH) + '...'
                        : scenario.description}
                    </p>
                  </div>
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
