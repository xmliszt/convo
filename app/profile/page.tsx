import { groupBy } from 'lodash';
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { ScenarioBackground } from '../scenarios/scenario-background';
import { ScenarioBackgroundProvider } from '../scenarios/scenario-background-provider';
import { ConversationLink } from './conversation-link';
import { EvaluationLink } from './evaluation-link';
import { fetchUserConversations } from './services/fetch-user-conversations';

const MAX_DESC_LENGTH = 180;

export default async function Page() {
  const { conversations } = await fetchUserConversations();
  const orderedByLatestDate = [...conversations].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  // Group conversations by scenario
  const groupedConversations = groupBy(
    orderedByLatestDate,
    (conversation) => conversation.scenario.id
  );
  const scenarioIds = Object.keys(groupedConversations);

  // Group evaluations by scenario
  const allEvaluations = conversations
    .map((conversation) => conversation.evaluation)
    .filter<NonNullable<Evaluation>>((evaluation) => evaluation !== null);
  const groupedEvaluations = groupBy(
    allEvaluations,
    (evaluation) =>
      conversations.find(
        (conversation) => conversation.id === evaluation.conversation_id
      )?.scenario_id
  );

  return (
    <ScenarioBackgroundProvider>
      <main>
        <ScrollArea className='h-screen w-full'>
          <div className='mx-auto flex h-full w-full max-w-lg flex-col gap-y-8 px-4 py-20'>
            <h1 className='my-4 text-center text-6xl font-bold'>Profile</h1>
            {/* Conversations card */}
            <Card className='bg-card/60 shadow-2xl'>
              <CardHeader>
                <CardTitle>
                  <h2 className='text-3xl font-bold'>Your conversations</h2>
                </CardTitle>
                <CardDescription>
                  <p>
                    Here are all the conversations you have created. Click on
                    any one to view or resume and resubmit for a new evaluation.
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-8'>
                  {scenarioIds.map((scenarioId) => {
                    const scenario =
                      groupedConversations[scenarioId][0].scenario;
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
                            <h3 className='text-lg font-bold'>
                              {scenario.name}
                            </h3>
                            <p className='max-h-[100px] text-xs'>
                              {scenario.description.length > MAX_DESC_LENGTH
                                ? scenario.description.slice(
                                    0,
                                    MAX_DESC_LENGTH
                                  ) + '...'
                                : scenario.description}
                            </p>
                          </div>
                          <div className='col-span-2 flex flex-col gap-y-2'>
                            {groupedConversations[scenarioId].length > 0 &&
                              groupedConversations[scenarioId].map(
                                (conversation, idx) => (
                                  <ConversationLink
                                    key={conversation.id}
                                    conversationId={conversation.id}
                                    conversationNumber={idx + 1}
                                    conversationCreatedAt={
                                      conversation.created_at
                                    }
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
            {/* Evaluations card */}
            <Card className='bg-card/60 shadow-2xl'>
              <CardHeader>
                <CardTitle>
                  <h2 className='text-3xl font-bold'>
                    Your evaluation results
                  </h2>
                </CardTitle>
                <CardDescription>
                  <p>
                    Here are all the result summary that you have received from
                    your conversations. Click on any one to view the detailed
                    evaluation and share with others.
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-8'>
                  {scenarioIds.map((scenarioId) => {
                    const scenario =
                      groupedConversations[scenarioId][0].scenario;
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
                            <h3 className='text-lg font-bold'>
                              {scenario.name}
                            </h3>
                            <p className='max-h-[100px] text-xs'>
                              {scenario.description.length > MAX_DESC_LENGTH
                                ? scenario.description.slice(
                                    0,
                                    MAX_DESC_LENGTH
                                  ) + '...'
                                : scenario.description}
                            </p>
                          </div>
                          <div className='col-span-2 flex flex-col gap-y-2'>
                            {groupedEvaluations[scenarioId].length > 0 &&
                              groupedEvaluations[scenarioId].map(
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
          </div>
        </ScrollArea>
        <ScenarioBackground />
      </main>
    </ScenarioBackgroundProvider>
  );
}
