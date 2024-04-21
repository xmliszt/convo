import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
        <CardTitle>
          <h2 className='text-3xl font-bold'>Your evaluation results</h2>
        </CardTitle>
        <CardDescription>
          <p>
            Here are all the result summary that you have received from your
            conversations. Click on any one to view the detailed evaluation and
            share with others.
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
                    {props.groupedEvaluations[scenarioId].length > 0 &&
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
