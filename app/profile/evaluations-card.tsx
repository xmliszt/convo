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

import { EvaluationLink } from './evaluation-link';

const MAX_DESC_LENGTH = 180;

type EvaluationsCardProps = {
  scenarioIds: string[];
  groupedConversations: Record<
    string,
    (Conversation & {
      scenario: Scenario;
    })[]
  >;
  groupedEvaluations: Record<string, Evaluation[]>;
};

export function EvaluationsCard(props: EvaluationsCardProps) {
  return (
    <Card className='bg-card/60 shadow-2xl'>
      <CardHeader>
        <CardTitle className='text-3xl font-bold'>
          Your evaluation results
        </CardTitle>
        <CardDescription>
          Here are all the result summary that you have received from your
          conversations. Click on any one to view the detailed evaluation and
          share with others.
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
                    {props.groupedEvaluations[scenarioId]?.length > 0 ? (
                      props.groupedEvaluations[scenarioId].map(
                        (evaluation, idx) => (
                          <EvaluationLink
                            key={evaluation.id}
                            evaluationId={evaluation.id}
                            evaluationNumber={idx + 1}
                            evaluationCreatedAt={evaluation.created_at}
                            scenarioImageUrl={scenario.image_url}
                          />
                        )
                      )
                    ) : (
                      <p className='text-sm text-gray-400'>
                        No evaluation results available yet.
                      </p>
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
